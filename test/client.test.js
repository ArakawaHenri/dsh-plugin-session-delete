import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const clientSource = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

function extractText(node) {
  if (typeof node === 'string') return node;
  return (node?.children || []).map(extractText).join(' ');
}

function findNode(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (predicate(node)) return node;
  return node.children?.map(child => findNode(child, predicate)).find(Boolean);
}

async function mountClient(response) {
  const components = new Map();
  const calls = [];
  const warnings = [];
  const React = {
    Fragment: Symbol('Fragment'),
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useSyncExternalStore: (_subscribe, snapshot) => snapshot(),
    useRef: value => ({ current: value }),
    useEffect: () => {},
  };

  let module;
  runInNewContext(clientSource, {
    console: { warn: (...args) => warnings.push(args) },
    window: {
      location: { reload: () => assert.fail('Deletion must not reload the UI') },
      __ModuleLoader__: {
        load(entry) {
          module = entry;
        },
      },
    },
  });
  assert.equal(module.id, 'dsh-plugin-session-delete');

  const plugin = module.factory(name => {
    assert.equal(name, 'react');
    return React;
  });

  let dictionaries;
  const services = new Map([
    [
      'slots',
      {
        inject: (_name, callback) => callback(),
        register: ({ name }, component) => components.set(name, component),
      },
    ],
    [
      'locale',
      {
        register: (_namespace, value) => {
          dictionaries = value;
        },
        bind: () => key => dictionaries.en[key],
        subscribe: () => () => {},
        getSnapshot: () => 'en',
      },
    ],
  ]);

  services.set('remote', {
    async $mount(contribution) {
      assert.equal(contribution.descriptors[0].namespace, 'sessionDelete');
      await Promise.resolve();
      services.set('remote.sessionDelete', {
        async deleteArchived(id) {
          calls.push(id);
          return response;
        },
      });
    },
  });

  function createContext(inject) {
    const declared = new Set(inject);
    for (const name of declared) {
      assert.ok(services.has(name), `Service ${name} is not mounted`);
    }

    function get(name) {
      if (!declared.has(name)) {
        throw new Error(`cannot get property ${name} without inject`);
      }
      assert.ok(services.has(name), `Service ${name} is not mounted`);
      return services.get(name);
    }

    const remote = {
      $mount: contribution => get('remote').$mount(contribution),
      get sessionDelete() {
        return get('remote.sessionDelete');
      },
    };

    return {
      get slots() {
        return get('slots');
      },
      get locale() {
        return get('locale');
      },
      get remote() {
        get('remote');
        return remote;
      },
      effect: callback => callback(),
      inject: (names, callback) => callback(createContext(names)),
    };
  }

  await plugin.apply(createContext(plugin.inject));
  return {
    calls,
    warnings,
    Menu: components.get('sidebar.workspaces.session.menu.item'),
    Overlay: components.get('shell.overlay'),
  };
}

for (const outcome of ['success', 'error']) {
  test(`client confirmation dialog handles ${outcome} response`, async () => {
    const id = 'selected-archived-session';
    const response =
      outcome === 'success'
        ? {
            ok: true,
            value: { warnings: ['Fixture cleanup warning'] },
          }
        : {
            ok: false,
            error: { code: 'session-delete/session-in-use', message: 'Fixture service error', details: {} },
          };

    const { calls, warnings, Menu, Overlay } = await mountClient(response);
    assert.equal(typeof Menu, 'function');
    assert.equal(typeof Overlay, 'function');

    const menuChanges = [];
    const item = Menu({
      sessionId: id,
      displayTitle: 'Selected archived session',
      useWorkspaces: selector => selector({ archivedSessionIds: [id] }),
      useMenuOpenState: () => [true, value => menuChanges.push(value)],
      useRemoteAccess: path => {
        assert.equal(path, 'sessionDelete/deleteArchived');
        return true;
      },
    });

    let stopped = 0;
    assert.equal(item.props.role, 'menuitem');
    item.props.onClick({ stopPropagation: () => stopped++ });
    assert.equal(stopped, 1);
    assert.deepEqual(menuChanges, [false]);

    const confirmation = Overlay();
    const dialog = findNode(confirmation, node => node.type === 'dialog');
    let closeCalls = 0;
    dialog.props.ref.current = { close: () => closeCalls++ };
    assert.match(extractText(confirmation), /Delete archived session\?/);
    assert.match(extractText(confirmation), /Selected archived session/);
    assert.match(extractText(confirmation), new RegExp(id));
    assert.deepEqual(calls, []);

    const confirmButton = findNode(
      confirmation,
      node => node.type === 'button' && extractText(node) === 'Delete session',
    );
    assert.ok(confirmButton);
    await Promise.all([confirmButton.props.onClick(), confirmButton.props.onClick()]);

    const result = Overlay();
    assert.deepEqual(calls, [id]);

    if (outcome === 'success') {
      assert.equal(closeCalls, 1);
      assert.equal(findNode(result, node => node.type === 'dialog'), undefined);
      assert.deepEqual(warnings, [['[dsh-plugin-session-delete]', 'Fixture cleanup warning']]);
    } else {
      assert.equal(closeCalls, 0);
      assert.ok(findNode(result, node => node.type === 'dialog'));
      assert.deepEqual(warnings, []);
      assert.match(
        extractText(findNode(result, node => node.props.role === 'alert')),
        /This session is still open or retained/,
      );
      assert.doesNotMatch(extractText(result), /Session deleted/);
    }
  });
}
