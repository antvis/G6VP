import Graphin from './Graphin';
export { default as Compatible } from './compatible';
export { default as Components } from './components';
export * as Utils from './utils';
export type GraphinData = any;

export type EdgeStyle = any;
export type IUserNode = any;
export type Layout = any;
export type IUserEdge = any;
export type ContextMenuValue = any;

export type GraphData = any;
export type NodeConfig = any;

export { Extensions, Graph, extend } from '@antv/g6';
export type { IG6GraphEvent, IGraph } from '@antv/g6';

export { GraphinContext, useGraphin } from './useGraphin';
export type { GraphinContextType } from './useGraphin';

export const registerNode = () => {};
//@ts-ignore
export const registerEdge = () => {};

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

export { default as Behaviors, registerBehavior, useBehaviorHook } from './behaviors';

export default Graphin;
