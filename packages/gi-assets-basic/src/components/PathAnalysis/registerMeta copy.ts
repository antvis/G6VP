import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.children.title.default = '路径分析';
metas.GIAC_CONTENT.children.icon.default = 'icon-star';
metas.GIAC_CONTENT.children.containerWidth.default = '400px';

const registerMeta = ({ schemaData }) => {
  const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});
  const options = Object.keys(nodeProperties)
    .filter(key => nodeProperties[key] === 'string')
    .map(e => ({ value: e, label: e }));

  return {
    pathNodeLabel: {
      name: '路径节点标签映射',
      type: 'select',
      options,
      default: 'id',
    },
    ...metas,
  };
};

export default registerMeta;
