# dsh-plugin-session-delete

Permanently deletes archived sessions in DeepSeek Harness (`0.2.1-rc.2`).

Harness keeps archived sessions on disk forever; this plugin adds a **Delete permanently…**
entry to the `…` menu of each archived session. A confirmation dialog shows the session
title and ID before anything is removed. On success the dialog closes and the session
disappears from the list.

A session is only deleted when it is archived, closed in every window, and has no running
work or active reminders. If it is still held somewhere, close the other windows (or
restart Harness) and try again.

What gets removed: the session's JSONL log files under its storage directory, including
older format generations, plus its workspace membership and archive entry. Everything
else stays — the lock file, unrelated files in the directory, workspace files,
attachments, and history already forked or copied into other sessions.

Deletion runs under Harness's own write lock. A failed deletion shows the reason in the
dialog; cleanup warnings after a successful one are logged to the browser console.

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
