import { extractDefault } from '@ali/react-datav-gui-utils';
const getKeysByData = data => {
  try {
    return Object.keys(data.nodes[0].data);
  } catch (error) {
    return ['id'];
  }
};

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
    const { info, registerMeta } = element;
    const keys = getKeysByData(data);
    const configObj = registerMeta({ data, keys });
    /** 默认的配置值 */
    const defaultProps = extractDefault({ config: configObj, value: {} });
    const { id, name, category } = info;

    const item = {
      id,
      props: defaultProps,
      name,
      info,
      meta: { configObj },
    };
    if (category === 'node') {
      nodeElements = {
        ...nodeElements,
        [id]: item,
      };
    }
    if (category === 'edge') {
      edgeElements = {
        ...edgeElements,
        [id]: item,
      };
    }
  });

  return {
    node: nodeElements,
    edge: edgeElements,
  };
};
export default getElementsByAssets;
