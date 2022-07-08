import { extra } from '@alipay/graphinsight';
import info from './info';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default = info.desc;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

const registerMeta = ({ schemaData }) => {
  const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});

  const edgeProperties = schemaData.edges.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});

  const nodeOptions = Object.entries(nodeProperties).map(e => {
    const [key, value] = e;
    return {label: `node-${key}`, value: `node-${key}`}
  })

  const edgeOptions =  Object.entries(edgeProperties).map(e => {
    const [key, value] = e;
    return {label: `edge-${key}`, value: `edge-${key}`}
  })

  const schema = {
    filterKeys: {
      title: '默认筛选字段',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      "x-component-props": {
        mode: "multiple",
      },
      enum: [...nodeOptions, ...edgeOptions],
      default: [],
    },
    isFilterIsolatedNodes: {
      title: '过滤孤立节点',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    highlightMode: {
      title: '高亮模式',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    filterLogic: {
      title: '筛选逻辑',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { value: 'and', label: 'and' },
        { value: 'or', label: 'or' },
      ],
      default: 'and',
    },
    ...metas,
  };

  return schema;
};

export default registerMeta;
