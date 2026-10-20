import { lstatSync, readdirSync, realpathSync, unlinkSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol';

function refuse(code, message) {
  throw new RemoteError(`session-delete/${code}`, message, {});
}

const LOG_FILE_PATTERN = /^session(?:\.v[1-9][0-9]*)?\.jsonl(?:\.zstd)?$/;

function sessionPath(persistence, header) {
  const location = persistence.locate(header);
  if (location.kind !== 'jsonl' || !isAbsolute(location.path)) {
    refuse('unsupported-backend', 'An absolute local JSONL path is required.');
  }

  // locate() encodes the header into safe path segments, so a lexical escape
  // (`..`) can only come from a foreign backend path — refuse it before any
  // filesystem access; the realpath comparison then rejects symlinked
  // directories that physically resolve outside the storage root.
  const path = resolve(location.path);
  const directory = dirname(path);
  const child = relative(resolve(persistence.root), directory);
  if (!child || child.startsWith('..') || realpathSync(directory) !== join(realpathSync(persistence.root), child)) {
    refuse('unsafe-path', 'Session storage resolves outside its expected directory.');
  }

  // DSH opens this file for writing before flock; a linked lock could truncate another file.
  try {
    const lock = lstatSync(join(directory, 'session.lock'));
    if (!lock.isFile() || lock.nlink !== 1) {
      refuse('unsafe-path', 'The session lock must be a regular file with one link.');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return path;
}

function logFiles(path) {
  const directory = dirname(path);
  const files = readdirSync(directory, { withFileTypes: true })
    .filter(entry => LOG_FILE_PATTERN.test(entry.name))
    .map(entry => {
      if (!entry.isFile()) refuse('unsafe-path', 'Session logs must be regular files.');
      return join(directory, entry.name);
    });
  if (!files.includes(path)) refuse('session-unavailable', 'The current session log is missing.');
  // Keep the current log until all historical generations have been removed.
  return files.sort((a, b) => Number(a === path) - Number(b === path));
}

function checkSessionState(ctx, registry, id) {
  if (!registry.archivedSessionIds.includes(id)) {
    refuse('not-archived', 'Archive the session before deleting it.');
  }
  if (ctx.sessions.get(id) || ctx.agents.get(id)) {
    refuse('session-in-use', 'Close this session in all windows and wait for its work to stop.');
  }
}

async function isMissing(persistence, id) {
  // stat() also returns undefined for an unreadable header. Only open()'s explicit
  // not-found error permits cleaning stale metadata, including after a restart.
  let handle;
  try {
    handle = await persistence.open(id, 'read');
  } catch (error) {
    if (error.name === 'SessionPersistenceNotFoundError') return true;
    throw error;
  } finally {
    await handle?.close();
  }
  return false;
}

export async function deleteArchivedSession(ctx, id) {
  const registry = ctx.workspaceRegistry;
  const persistence = ctx.sessionPersistence;
  checkSessionState(ctx, registry, id);

  const snapshot = await persistence.stat(id);
  let path;
  let handle;
  if (snapshot) {
    if (snapshot.formatStatus !== 'current') {
      refuse('unsupported-format', 'Open this session to migrate it before deleting.');
    }
    path = sessionPath(persistence, snapshot.header);
    try {
      handle = await persistence.open(id, 'write');
    } catch (error) {
      if (error.name === 'SessionAlreadyOwnedError') {
        refuse('session-in-use', 'Another window or process owns this session. Close it before deleting.');
      }
      throw error;
    }
  } else if (!await isMissing(persistence, id)) {
    refuse('session-unavailable', 'The session log could not be verified.');
  }

  const warnings = [];
  try {
    const activity = await ctx.waterfall('workspace/session-activity', { sessionId: id }, async () => []);
    if (activity.length > 0) {
      refuse('session-active', 'The session still has running work or active reminders.');
    }
    checkSessionState(ctx, registry, id);
    // Provider teardown closes its handles and releases their locks.
    if (ctx.sessionPersistence.identity !== persistence.identity) {
      refuse('session-changed', 'Session storage changed during deletion preparation.');
    }
    if (handle) {
      if (persistence.locate(handle.header).path !== path) {
        refuse('session-changed', 'The locked session path changed during deletion preparation.');
      }
      for (const file of logFiles(path)) unlinkSync(file);
    }
    try {
      for (const workspace of registry.list()) await workspace.detachSession(id);
      await registry.unarchiveSession(id);
    } catch (error) {
      warnings.push(`Logs removed; workspace cleanup needs a retry: ${error.message}`);
    }
  } finally {
    if (handle) {
      try {
        await handle.close();
      } catch (error) {
        warnings.push(`Session lock release reported: ${error.message}`);
      }
    }
  }
  return { warnings };
}
