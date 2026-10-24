window.__ModuleLoader__.load({
  id: 'dsh-plugin-session-delete',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const styles = `
      .dsh-sd-menu-item {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        min-height: 34px;
        padding: 6px 8px;
        border: 0;
        border-radius: var(--dsw-radius-md);
        background: transparent;
        color: var(--dsw-alias-state-error-primary);
        font-family: inherit;
        font-size: 13px;
        line-height: 20px;
        text-align: left;
        cursor: pointer;
      }
      .dsh-sd-menu-item:hover,
      .dsh-sd-menu-item:focus-visible {
        background: var(--dsw-alias-interactive-bg-hover-danger);
        outline: none;
      }
      .dsh-sd-menu-icon {
        display: inline-flex;
        flex: none;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        color: inherit;
      }
      .dsh-sd-menu-icon svg {
        width: 14px;
        height: 14px;
      }
      .dsh-sd-menu-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dsh-sd-dialog {
        pointer-events: auto;
        box-sizing: border-box;
        width: min(380px, calc(100vw - 48px));
        max-height: calc(100dvh - max(24px, var(--dsh-frame-overlay-top, 24px)) - max(24px, var(--dsh-frame-overlay-top, 24px)));
        margin: auto;
        padding: 0 0 24px;
        overflow: hidden;
        border: 0;
        border-radius: var(--dsw-radius-panel);
        background: var(--dsw-alias-bg-layer-2);
        box-shadow: var(--dsw-elevation-prominent);
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
        font-size: 14px;
        line-height: 22px;
      }
      .dsh-sd-dialog[open] {
        display: flex;
        flex-direction: column;
        gap: 20px;
        animation: dsh-sd-modal-enter var(--ds-transition-duration) var(--ds-ease-in-out);
      }
      .dsh-sd-dialog::backdrop {
        inset: var(--dsh-frame-chrome-top, 0px) 0 0;
        background: var(--dsw-alias-bg-mask-1);
        backdrop-filter: var(--dsw-mask-blur);
        animation: dsh-sd-modal-enter var(--ds-transition-duration) var(--ds-ease-in-out);
      }
      .dsh-sd-dialog:focus {
        outline: none;
      }
      .dsh-sd-content {
        display: flex;
        flex-direction: column;
        min-height: 0;
        width: 100%;
        overflow: auto;
      }
      .dsh-sd-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 22px 14px 12px 24px;
      }
      .dsh-sd-title {
        margin: 0;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: var(--dsw-alias-label-primary);
      }
      .dsh-sd-close {
        flex: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: var(--dsw-radius-sm);
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        cursor: pointer;
      }
      .dsh-sd-close:hover:not(:disabled) {
        background: var(--dsw-alias-interactive-bg-hover);
      }
      .dsh-sd-description {
        margin: 0;
        padding: 0 24px;
        font-size: 14px;
        line-height: 22px;
        font-weight: 400;
      }
      .dsh-sd-body {
        display: flex;
        flex-direction: column;
        min-width: 0;
        gap: 8px;
        margin-top: 20px;
        padding: 0 24px;
        overflow-wrap: anywhere;
      }
      .dsh-sd-body p {
        margin: 0;
      }
      .dsh-sd-session {
        font-weight: 500;
      }
      .dsh-sd-id {
        display: block;
        font-size: 12px;
        line-height: 18px;
        color: var(--dsw-alias-label-secondary);
      }
      .dsh-sd-error {
        color: var(--dsw-alias-state-error-primary);
      }
      .dsh-sd-actions {
        flex: none;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
        padding: 0 24px;
      }
      .dsh-sd-button {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        height: 36px;
        padding: 0 14px;
        border: 0.5px solid var(--dsw-alias-border-l3);
        border-radius: var(--dsw-radius-md);
        background: transparent;
        color: var(--dsw-alias-label-primary);
        font-family: inherit;
        font-size: 14px;
        line-height: 22px;
        cursor: pointer;
      }
      .dsh-sd-button:hover:not(:disabled) {
        background: var(--dsw-alias-interactive-bg-hover);
      }
      .dsh-sd-dialog button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .dsh-sd-dialog button:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary);
        outline-offset: 2px;
      }
      .dsh-sd-danger {
        color: var(--dsw-alias-state-error-primary);
      }
      .dsh-sd-recovery {
        position: fixed;
        right: 24px;
        bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: min(380px, calc(100vw - 48px));
        padding: 12px 16px;
        box-sizing: border-box;
        border-radius: var(--dsw-radius-md);
        background: var(--dsw-alias-bg-layer-2);
        box-shadow: var(--dsw-elevation-prominent);
        color: var(--dsw-alias-label-primary);
        font-size: 13px;
        line-height: 20px;
        pointer-events: auto;
      }
      .dsh-sd-recovery-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .dsh-sd-recovery button {
        flex: none;
      }
      .dsh-sd-recovery select {
        min-width: 0;
        max-width: 180px;
        text-overflow: ellipsis;
      }
      .dsh-sd-recovery span {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .dsh-sd-refresh-error {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      @keyframes dsh-sd-modal-enter {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dsh-sd-dialog[open],
        .dsh-sd-dialog::backdrop {
          animation: none;
        }
      }
    `;

    const remoteContribution = function remoteContribution() {
      const packageName = 'dsh-plugin-session-delete';

      const sessionIdCodec = {
        mode: 'strict',
        typeSymbol: `${packageName}#SessionId`,
        create: () => ({
          parse(value) {
            if (typeof value !== 'string' || !value.trim() || value.length > 512) {
              throw new TypeError('Expected a nonempty session ID.');
            }
            return value;
          },
        }),
        jsonSchema: { type: 'string', minLength: 1, maxLength: 512 },
      };

      return {
        package: packageName,
        descriptors: [
          {
            id: `${packageName}#sessionDelete/deleteArchived`,
            service: 'sessionDelete',
            namespace: 'sessionDelete',
            method: 'deleteArchived',
            invocation: { kind: 'direct' },
            parameters: [{ name: 'sessionId', wire: 'sessionId', source: 'json', codec: sessionIdCodec }],
            result: { mode: 'src-json' },
          },
        ],
      };
    };

    const dictionaries = {
      en: {
        delete: 'Delete permanently…',
        heading: 'Delete archived session?',
        untitled: 'Untitled session',
        description:
          'This permanently removes this session’s conversation logs. This action cannot be undone. Files in your workspace, attachments, and history copied into other sessions are kept.',
        cancel: 'Cancel',
        confirm: 'Delete session',
        deleting: 'Deleting…',
        close: 'Close',
        cleanupHeading: 'Finish removing session?',
        cleanupDescription: 'The conversation logs have been deleted. Retry to remove the remaining workspace and archive records.',
        cleanupFailed: 'Could not finish removing the session records.',
        retryCleanup: 'Retry cleanup',
        cleaning: 'Cleaning up…',
        unlistedArchive: 'An archived session is missing from the session list.',
        reviewCleanup: 'Review cleanup',
        refreshFailed: 'Could not refresh the session list.',
        refreshIncomplete: 'The refresh did not finish. Please retry.',
        retryRefresh: 'Retry refresh',
        inUse:
          'This session is still in use by another owner. Close it in other windows or processes and try again.',
        notArchived: 'This session is no longer archived. Archive it before deleting.',
        active: 'This session still has running work or active reminders. Stop them before deleting.',
        format:
          'This session uses an older or unsupported format. Open it to migrate, then archive and close it before retrying.',
        unsupported: 'This session storage does not expose the local JSONL interfaces needed for deletion.',
        runtime: 'Harness did not expose a complete release action for this retained session. Restart Harness and try again.',
        unavailable: 'The session log cannot be verified. Its storage and metadata were left unchanged.',
      },
      zh: {
        delete: '永久删除…',
        heading: '删除已归档会话？',
        untitled: '未命名会话',
        description:
          '将永久删除此会话的对话日志，无法撤销。工作区中的文件、附件，以及已复制到其他会话的历史记录会保留。',
        cancel: '取消',
        confirm: '删除会话',
        deleting: '正在删除…',
        close: '关闭',
        cleanupHeading: '完成会话清理？',
        cleanupDescription: '对话日志已经删除。请重试清理剩余的工作区和归档记录。',
        cleanupFailed: '会话记录尚未清理完成。',
        retryCleanup: '重试清理',
        cleaning: '正在清理…',
        unlistedArchive: '有归档记录未出现在会话列表中。',
        reviewCleanup: '查看并清理',
        refreshFailed: '会话列表刷新失败。',
        refreshIncomplete: '刷新尚未完成，请重试。',
        retryRefresh: '重试刷新',
        inUse: '此会话仍被其他实例占用。请在其他窗口或进程中关闭它后重试。',
        notArchived: '此会话已不在归档中，请先归档再删除。',
        active: '此会话仍有运行中的工作或启用的提醒，请先停止后再删除。',
        format: '此会话使用旧格式或暂不支持的格式。请打开它完成迁移，再归档并关闭后重试。',
        unsupported: '当前会话存储未提供删除所需的本地 JSONL 接口。',
        runtime: 'Harness 未提供此常驻会话的完整释放操作，请重启 Harness 后重试。',
        unavailable: '无法核实此会话的日志状态，文件和会话记录均未改动。',
      },
    };

    const ERROR_KEYS = {
      'session-in-use': 'inUse',
      'not-archived': 'notArchived',
      'session-active': 'active',
      'unsupported-format': 'format',
      'unsupported-backend': 'unsupported',
      'unsupported-runtime': 'runtime',
      'session-unavailable': 'unavailable',
      'cleanup-failed': 'cleanupFailed',
    };

    function TrashIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': true,
          focusable: false,
          strokeWidth: 1,
        },
        h('path', { d: 'M1.28149 3.88831H14.7187', stroke: 'currentColor' }),
        h('path', {
          d: 'M5.41602 3.88833V2.47962C5.41602 2.29282 5.52492 2.11366 5.71876 1.98157C5.9126 1.84948 6.17551 1.77527 6.44964 1.77527H9.55053C9.82466 1.77527 10.0876 1.84948 10.2814 1.98157C10.4753 2.11366 10.5842 2.29282 10.5842 2.47962V3.88833',
          stroke: 'currentColor',
        }),
        h('path', {
          d: 'M2.57349 3.88831L3.19366 13.2943C3.21937 13.5502 3.33952 13.7872 3.53065 13.9593C3.72178 14.1313 3.97016 14.2259 4.22729 14.2246H11.7728C12.0299 14.2259 12.2783 14.1313 12.4694 13.9593C12.6605 13.7872 12.7807 13.5502 12.8064 13.2943L13.4266 3.88831',
          stroke: 'currentColor',
        }),
        h('path', { d: 'M6.44946 6.98926V11.1238', stroke: 'currentColor' }),
        h('path', { d: 'M9.55054 6.98926V11.1238', stroke: 'currentColor' }),
      );
    }

    function CloseIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': true,
          focusable: false,
          strokeWidth: 1,
        },
        h('path', { d: 'M2.5 2.5L13.5 13.5', stroke: 'currentColor' }),
        h('path', { d: 'M13.5 2.5L2.5 13.5', stroke: 'currentColor' }),
      );
    }

    function mountUI(ctx) {
      ctx.effect(() => ctx.locale.register('dsh.sessionDelete', dictionaries));
      const t = ctx.locale.bind('dsh.sessionDelete');
      // Workspace list sources expose instance methods, so retain their receiver.
      const sessionSource = {
        subscribe: listener => ctx.sessions.list.subscribe(listener),
        getSnapshot: () => ctx.sessions.list.getSnapshot(),
      };
      const workspaceSource = {
        subscribe: listener => ctx.workspaces.list.subscribe(listener),
        getSnapshot: () => ctx.workspaces.list.getSnapshot(),
      };

      let state = { confirmation: null, refreshError: null };
      let disposed = false;
      const listeners = new Set();
      const store = {
        getSnapshot: () => state,
        subscribe: fn => {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
      };

      function setState(next) {
        if (disposed) return;
        state = { ...state, ...next };
        for (const fn of listeners) fn();
      }

      ctx.effect(() => () => {
        disposed = true;
        listeners.clear();
        state = { confirmation: null, refreshError: null };
      });

      async function refreshList() {
        await ctx.sessions.refresh();
        // The public list omits errors and refresh() resolves on RPC failures.
        // Read the native manager's result after the request has settled.
        const result = ctx.sessions.manager.getListSnapshot();
        // Reconnection can replace the awaited request with a still-loading one.
        if (result.state !== 'idle') throw result.error || new Error(t('refreshIncomplete'));
      }

      async function refreshSessions(sessionId) {
        try {
          await refreshList();
          // refresh() joins an existing request. If it returned an older list,
          // make one fresh read after that request has finished.
          if (ctx.sessions.list.getSnapshot().ids.includes(sessionId)) await refreshList();
          setState({ refreshError: null });
        } catch (error) {
          setState({ refreshError: String(error?.message || error) });
          console.warn('[dsh-plugin-session-delete] List refresh failed:', error);
        }
      }

      ctx.effect(() => ctx.remote.$on('api-session/removed', (sessionId, source) => {
        if (source === 'dsh-plugin-session-delete') return refreshSessions(sessionId);
      }));

      function showConfirmation(sessionId, title) {
        setState({ confirmation: { sessionId, title: title || t('untitled'), busy: false, error: null, cleanupPending: false } });
      }

      function useTranslation() {
        React.useSyncExternalStore(
          fn => ctx.locale.subscribe(fn),
          () => ctx.locale.getSnapshot(),
        );
        return t;
      }

      function DeleteItem(props) {
        const translate = useTranslation();
        const archived = props.useWorkspaces(snapshot => snapshot.archivedSessionIds.includes(props.sessionId));
        const [, setMenuOpen] = props.useMenuOpenState();
        const allowed = props.useRemoteAccess('sessionDelete/deleteArchived');
        if (!archived || !allowed) return null;

        return h(
          'button',
          {
            type: 'button',
            role: 'menuitem',
            className: 'dsh-sd-menu-item',
            onClick: event => {
              event.stopPropagation();
              setMenuOpen(false);
              showConfirmation(props.sessionId, props.displayTitle);
            },
          },
          h('span', { className: 'dsh-sd-menu-icon' }, TrashIcon()),
          h('span', { className: 'dsh-sd-menu-label' }, translate('delete')),
        );
      }

      function Overlay() {
        const translate = useTranslation();
        const { confirmation: current, refreshError } = React.useSyncExternalStore(store.subscribe, store.getSnapshot);
        const sessions = React.useSyncExternalStore(sessionSource.subscribe, sessionSource.getSnapshot);
        const workspaces = React.useSyncExternalStore(workspaceSource.subscribe, workspaceSource.getSnapshot);
        const dialog = React.useRef(null);

        React.useEffect(() => {
          const element = dialog.current;
          if (current && element && !element.open) {
            element.showModal();
          }
        }, [current]);

        const refreshNotice = refreshError && h(React.Fragment, null,
          h('span', null, `${translate('refreshFailed')} ${refreshError}`),
          h('button', {
            type: 'button', className: 'dsh-sd-button',
            onClick: () => refreshSessions(),
          }, translate('retryRefresh')),
        );

        if (!current) {
          // The archive set is durable, so failed cleanup remains reachable
          // after a reload without keeping a separate deletion receipt.
          const listed = new Set(sessions.ids);
          const unlisted = sessions.phase === 'ready' && workspaces.phase === 'ready'
            ? workspaces.archivedSessionIds.filter(id => !listed.has(id))
            : [];
          const review = id => showConfirmation(id, sessions.byId[id]?.displayTitle);
          return h(React.Fragment, null,
            h('style', null, styles),
            (refreshNotice || unlisted.length > 0) && h('aside', { className: 'dsh-sd-recovery', role: 'status' },
              refreshNotice && h('div', { className: 'dsh-sd-recovery-row', role: 'alert' }, refreshNotice),
              unlisted.length > 0 && h('div', { className: 'dsh-sd-recovery-row' },
                h('span', null, translate('unlistedArchive')),
                unlisted.length === 1 ? h('button', {
                  type: 'button', className: 'dsh-sd-button',
                  onClick: () => review(unlisted[0]),
                }, translate('reviewCleanup')) : h('select', {
                  className: 'dsh-sd-button',
                  'aria-label': translate('reviewCleanup'),
                  value: '',
                  onChange: event => review(event.target.value),
                },
                  h('option', { value: '', disabled: true }, translate('reviewCleanup')),
                  ...unlisted.map(id => h('option', { key: id, value: id }, sessions.byId[id]?.displayTitle || id)),
                ),
              ),
            ),
          );
        }

        const dismiss = () => {
          if (!current.busy) {
            dialog.current?.close();
            setState({ confirmation: null });
          }
        };

        const perform = async () => {
          if (state.confirmation !== current || current.busy) return;
          setState({ confirmation: { ...current, busy: true, error: null } });
          try {
            const response = await ctx.remote.sessionDelete.deleteArchived(current.sessionId);
            if (!response.ok) throw response.error;
            dialog.current?.close();
            setState({ confirmation: null });
            for (const warning of response.value.warnings) {
              console.warn('[dsh-plugin-session-delete]', warning);
            }
          } catch (error) {
            const code = String(error?.code || '').split('/').at(-1);
            const key = ERROR_KEYS[code];
            const cleanupFailed = code === 'cleanup-failed';
            setState({ confirmation: {
              ...current,
              busy: false,
              cleanupPending: current.cleanupPending || cleanupFailed,
              error: cleanupFailed
                ? `${translate('cleanupFailed')} ${error.details.reason}`
                : key ? translate(key) : String(error?.message || error),
            } });
          } finally {
            // A list request must not keep a completed deletion's dialog busy.
            void refreshSessions(current.sessionId);
          }
        };

        return h(
          React.Fragment,
          null,
          h('style', null, styles),
          h(
            'dialog',
            {
              ref: dialog,
              className: 'dsh-sd-dialog',
              role: 'dialog',
              'aria-modal': true,
              'aria-labelledby': 'dsh-sd-title',
              'aria-describedby': 'dsh-sd-description',
              onCancel: event => {
                event.preventDefault();
                dismiss();
              },
              onClick: event => {
                if (event.target === event.currentTarget) {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const outside =
                    event.clientX < rect.left ||
                    event.clientX > rect.right ||
                    event.clientY < rect.top ||
                    event.clientY > rect.bottom;
                  if (outside) dismiss();
                }
              },
            },
            h(
              'div',
              { className: 'dsh-sd-content' },
              h(
                'div',
                { className: 'dsh-sd-header' },
                h(
                  'h2',
                  { id: 'dsh-sd-title', className: 'dsh-sd-title' },
                  translate(current.cleanupPending ? 'cleanupHeading' : 'heading'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-sd-close',
                    'aria-label': translate('close'),
                    disabled: current.busy,
                    onClick: dismiss,
                  },
                  CloseIcon(),
                ),
              ),
              h(
                'p',
                { id: 'dsh-sd-description', className: 'dsh-sd-description' },
                translate(current.cleanupPending ? 'cleanupDescription' : 'description'),
              ),
              h(
                'div',
                { className: 'dsh-sd-body' },
                h('p', { className: 'dsh-sd-session' }, current.title),
                h('code', { className: 'dsh-sd-id' }, current.sessionId),
                current.error && h('p', { role: 'alert', className: 'dsh-sd-error' }, current.error),
                refreshNotice && h('div', { className: 'dsh-sd-refresh-error', role: 'alert' }, refreshNotice),
              ),
            ),
            h(
              'div',
              { className: 'dsh-sd-actions' },
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sd-button',
                  disabled: current.busy,
                  autoFocus: true,
                  onClick: dismiss,
                },
                translate(current.cleanupPending ? 'close' : 'cancel'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dsh-sd-button dsh-sd-danger',
                  disabled: current.busy,
                  onClick: perform,
                },
                translate(current.cleanupPending
                  ? current.busy ? 'cleaning' : 'retryCleanup'
                  : current.busy ? 'deleting' : 'confirm'),
              ),
            ),
          ),
        );
      }

      ctx.slots.inject('sidebar.workspaces.session.menu.item', () =>
        ctx.slots.register(
          {
            name: 'sidebar.workspaces.session.menu.item',
            id: 'dsh-plugin-session-delete.delete',
            order: 500,
            label: () => t('delete'),
          },
          DeleteItem,
        ),
      );
      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'dsh-plugin-session-delete.dialog',
            order: 100,
          },
          Overlay,
        ),
      );
    }

    return {
      inject: ['remote'],
      async apply(ctx) {
        await ctx.remote.$mount(remoteContribution());
        ctx.inject(['slots', 'locale', 'remote', 'remote.sessionDelete', 'sessions', 'workspaces'], mountUI);
      },
    };
  },
});
