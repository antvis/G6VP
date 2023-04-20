import { extra } from '@antv/gi-sdk';
import info from './info';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default = info.desc;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

const registerMeta = ({ schemaData, hasPropertyGraph }) => {
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
    return { label: `node-${key}`, value: `node-${key}` };
  });

  const edgeOptions = Object.entries(edgeProperties).map(e => {
    const [key, value] = e;
    return { label: `edge-${key}`, value: `edge-${key}` };
  });

  const schema = {
    filterKeys: {
      title: '默认筛选字段',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      enum: [...nodeOptions, ...edgeOptions],
      default: [],
    },
    enableInfoDetect: hasPropertyGraph
      ? {
          title: '智能推荐',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        }
      : undefined,
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
    histogramOptions: {
      type: 'object',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse.CollapsePanel',
      'x-component-props': {
        header: '分箱设置',
      },
      properties: {
        isCustom: {
          title: '自定义分箱',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
          'x-reactions': [
            {
              target: 'histogramOptions.min',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
            {
              target: 'histogramOptions.max',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
            {
              target: 'histogramOptions.binWidth',
              fulfill: {
                state: {
                  visible: '{{$self.value}}',
                },
              },
            },
          ],
        },
        min: {
          title: '区间最小值',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: null,
        },
        max: {
          title: '区间最大值',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: null,
        },
        binWidth: {
          title: '分箱值',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: null,
        },
      },
    },
    ...metas,
  };

  if (!hasPropertyGraph) delete schema.enableInfoDetect;

  return schema;
};

export default registerMeta;
