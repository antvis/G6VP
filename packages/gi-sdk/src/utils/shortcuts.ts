import { useEffect } from 'react';
import Mousetrap from 'mousetrap';

type Callback = Parameters<typeof Mousetrap.bind>[1];

/**
 * @description 绑定快捷键
 * @description Bind a key to a callback function.
 */
export const Shortcuts = (() => {
  const handlers: Map<Function, Callback> = new Map();

  const on = (...args: Parameters<typeof Mousetrap.bind>) => {
    const [key, callback, action] = args;
    if (!key || !callback) return;

    if (!handlers.has(callback)) {
      const wrapper = (e: KeyboardEvent, combo: string) => {
        e.preventDefault();
        try {
          callback?.(e, combo);
        } catch {}
      };
      handlers.set(callback, wrapper);
    }

    Mousetrap.bind(key, handlers.get(callback)!, action);
  };

  const off = (...args: Parameters<typeof Mousetrap.unbind>) => {
    const [key, action] = args;
    if (!key) return;

    Mousetrap.unbind(key, action);
  };

  const emit = (...args: Parameters<typeof Mousetrap.trigger>) => {
    const [key, action] = args;
    if (!key) return;

    Mousetrap.trigger(key, action);
  };

  const reset = () => {
    Mousetrap.reset();
  };

  return { on, off, emit, reset };
})();

/**
 * @example
 * useShortcuts('ctrl+s', () => {
 *  console.log('save');
 * });
 */
export const useShortcuts = (...args: Parameters<typeof Mousetrap.bind>) => {
  useEffect(() => {
    Shortcuts.on(...args);
    return () => {
      const [key, , action] = args;
      Shortcuts.off(key, action);
    };
  }, []);
};
