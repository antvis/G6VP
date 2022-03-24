import type { TypeAssetInfo } from './typing';
import { getKeysByData } from './utils';

/**
 *
 * @param assets 服务端拿到的资产：Elements
 * @param data 图数据
 * @returns
 */
const getElementsByAssets = (assets, data) => {
  let nodeElements = {};
  let edgeElements = {};

  Object.keys(assets).forEach(key => {
    const element = assets[key];
    //@ts-ignore
    const { info, registerMeta, registerShape, registerTransform, defaultProps } = element;
    const { id, name, category, type } = info as TypeAssetInfo;

    const keys = getKeysByData(data, category);
    const configObj = registerMeta({ data, keys });
    /** 默认的配置值 */
    // const defaultProps = extractDefault({ config: configObj, value: {} });

    const item = {
      id,
      props: defaultProps,
      name,
      info,
      // meta: { configObj },
      meta: configObj,
      // registerShape,
      // registerTransform,
    };
    if (category === 'node' || type === 'NODE') {
      nodeElements = {
        ...nodeElements,
        [id]: item,
      };
    }
    if (category === 'edge' || type === 'EDGE') {
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
