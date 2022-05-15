import type { AssetInfo } from '../typing';
import { uniqueElementsBy } from './common';

/**
 *
 * @param assets 服务端拿到的资产：Elements
 * @param data 图数据
 * @returns
 */
const getElementsByAssets = (assets, data, schemaData) => {
  let nodeElements = {};
  let edgeElements = {};

  Object.keys(assets).forEach(key => {
    const element = assets[key];
    //@ts-ignore

    const { info, registerMeta, registerShape, registerTransform, defaultProps } = element;
    const { id, name, category, type } = info as AssetInfo;

    const elementType = type === 'NODE' ? 'nodes' : 'edges';
    const propertiesKey = schemaData[elementType].reduce((acc, curr) => {
      const { properties } = curr;
      const item = Object.keys(properties).map(c => {
        return {
          id: c,
          type: properties[c],
        };
      });
      return [...acc, ...item];
    }, []);

    const keys = uniqueElementsBy(propertiesKey, (a, b) => {
      return a.id === b.id;
    });

    const configObj = registerMeta({ data, keys, schemaData });
    /** 默认的配置值 */
    // const defaultProps = extractDefault({ config: configObj, value: {} });

    const item = {
      ...element,
      id,
      props: defaultProps,
      name,
      info,
      meta: configObj,
    };
    if (elementType === 'nodes') {
      nodeElements = {
        ...nodeElements,
        [id]: item,
      };
    }
    if (elementType === 'edges') {
      edgeElements = {
        ...edgeElements,
        [id]: item,
      };
    }
  });

  return {
    nodes: nodeElements,
    edges: edgeElements,
  };
};
export default getElementsByAssets;
