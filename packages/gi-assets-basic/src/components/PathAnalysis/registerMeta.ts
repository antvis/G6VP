import { extra } from '@alipay/graphinsight';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = '路径分析';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = 'icon-star';
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';


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
      title: '路径节点标签映射',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: options,
      default: 'id',
    },
    ...metas,
  };
};

export default registerMeta;
