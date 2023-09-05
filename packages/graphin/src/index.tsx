import Graphin from './Graphin';
export * as Utils from './utils';

export type GraphinData = any;
export type Graph = any;
export type EdgeStyle = any;
export type IUserNode = any;
export type Layout = any;
export type IUserEdge = any;
export type ContextMenuValue = any;

export { GraphinContext, GraphinContextType, useGraphin } from './useGraphin';

export const registerNode = () => {};
//@ts-ignore
export const registerEdge = () => {};
//@ts-ignore
export const registerBehavior = () => {};
//@ts-ignore
export const registerFontFamily = iconLoader => {
  /**  注册 font icon */
  const iconFont = iconLoader();
  const { glyphs, fontFamily } = iconFont;
  const icons = glyphs.map(item => {
    return {
      name: item.name,
      unicode: String.fromCodePoint(item.unicode_decimal),
    };
  });

  return new Proxy(icons, {
    get: (target, propKey: string) => {
      const matchIcon = target.find(icon => {
        return icon.name === propKey;
      });
      if (!matchIcon) {
        console.error(`%c fontFamily:${fontFamily},does not found ${propKey} icon`);
        return '';
      }
      return matchIcon?.unicode;
    },
  });
};

export const Behaviors = {};
export const Components = {
  MiniMap: () => null,
};
export const useBehaviorHook = () => {};
export default Graphin;
