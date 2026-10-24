# dsh-plugin-session-delete

Permanently deletes archived sessions in DeepSeek Harness.

Harness keeps archived sessions on disk forever; this plugin adds a **Delete permanently…**
entry to the `…` menu of each archived session. A confirmation dialog shows the session
title and ID before anything is removed. On success the dialog closes and the session
disappears from the list.

A session is only deleted when it is archived and has no running work or active
reminders. Idle Agents retained by Harness are released through its native lifecycle
before deletion, so sessions created or opened during the current run can be deleted
without restarting. Running work and maintenance are left alone. A write lock held by
another process still prevents deletion; close that session there and try again.

What gets removed: the session's JSONL log files under its storage directory, including
older format generations, plus its workspace membership and archive entry. Everything
else stays — the lock file, unrelated files in the directory, workspace files,
attachments, and history already forked or copied into other sessions.

Deletion runs under Harness's own write lock and notifies connected windows to update
their session lists in the background. A failed list refresh shows **Retry refresh**;
this only reloads the list and does not repeat deletion. Ordinary Agent disposal does
not trigger the plugin's list refresh. If the logs are deleted but record cleanup fails, the dialog
shows the reason and offers **Retry cleanup**. After closing or reloading the page,
a **Review cleanup** notice exposes archived entries missing from the session list.
When several records remain, a dropdown lets you choose any of them;
the same deletion checks verify their storage before cleaning them up. Once native storage
confirms that the logs are absent, cleanup can be repeated even if another window
already finished it or the successful response was lost. Lock-release
warnings after a successful deletion are logged to the browser console.

## Compatibility

The declared Harness and protocol range is `>=0.2.1-rc.2`, with no upper version
limit. Later releases can load the plugin as long as the interfaces it uses remain
compatible; the plugin does not compare the running Harness version to an allowlist.

Deletion uses the host's JSONL locator, provider identity, native write ownership,
archive/activity checks, and workspace cleanup. Log generations are selected by the
backend's `current` classification, not a hardcoded format version. Releasing a
retained idle Agent additionally needs the native `agentLoop.lifecycle(id)` effect.
If that action is unavailable, only deletion of the retained session is refused;
already released sessions can still be deleted. Changed storage interfaces produce
an explicit error when used. List refresh reads the native session manager's result,
since the public list snapshot omits refresh errors.

The complete automated suite has passed against `0.2.1-rc.2` and `0.2.1-rc.3`,
including native Agent teardown and JSONL deletion. Development dependencies stay
pinned to `0.2.1-rc.2` for reproducibility; they do not restrict the host version.

## Install

Install from GitHub into your current profile:

```
plugin_manager install_bundle https://github.com/ArakawaHenri/dsh-plugin-session-delete
```

Then restart Harness.

## Build & test

`src/client.template.js` is the client source; `scripts/build-client.js` inlines the RPC
definitions from `remote.js` into `client.js`.

```sh
node scripts/build-client.js
node --test test/*.test.js
node --check index.js && node --check deletion.js && node --check client.js && node --check remote.js
```

## License

MIT. The trash and close icons are copied from Harness's
`@deepseek-ai/dsh-client-ui-primitives`; see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
