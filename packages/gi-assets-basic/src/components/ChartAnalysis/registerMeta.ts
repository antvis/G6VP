import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
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
    return { label: key, value: key };
  });

  const edgeOptions = Object.entries(edgeProperties).map(e => {
    const [key, value] = e;
    return { label: key, value: key };
  });
  return {
    title: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.ChartTitle', dm: '图表标题' }),
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      type: 'string',
      default: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.UnnamedChart', dm: '未命名图表' }),
    },
    chartType: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.ChartType', dm: '图表类型' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          value: 'columnChart',
          label: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.Histogram', dm: '柱状图' }),
        },
        {
          value: 'lineChart',
          label: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.LineChart', dm: '折线图' }),
        },
      ],

      default: 'columnChart',
    },
    brushMode: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.InteractionMode', dm: '交互模式' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          value: 'highlight',
          label: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.Highlight', dm: '高亮' }),
        },
        {
          value: 'filter',
          label: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.Filtering', dm: '过滤' }),
        },
      ],

      default: 'highlight',
    },
    height: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.ChartHeight', dm: '图表高度' }),
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      type: 'number',
      default: undefined,
    },

    dataType: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.DataType', dm: '数据类型' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          value: 'nodes',
          label: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.NodeData', dm: '节点数据' }),
        },
        {
          value: 'edges',
          label: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.EdgeData', dm: '边数据' }),
        },
      ],

      default: 'edges',
      'x-reactions': [
        {
          target: 'xField_nodes',
          fulfill: {
            state: {
              visible: '{{$self.value==="nodes"?true:false }}',
            },
          },
        },
        {
          target: 'yField_nodes',
          fulfill: {
            state: {
              visible: '{{$self.value==="nodes"?true:false }}',
            },
          },
        },
        {
          target: 'xField_edges',
          fulfill: {
            state: {
              visible: '{{$self.value==="edges"?true:false }}',
            },
          },
        },
        {
          target: 'yField_edges',
          fulfill: {
            state: {
              visible: '{{$self.value==="edges"?true:false }}',
            },
          },
        },
      ],
    },
    xField_nodes: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.XAxisField', dm: 'X轴字段' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...nodeOptions],
    },
    yField_nodes: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.YAxisField', dm: 'Y轴字段' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...nodeOptions],
    },
    xField_edges: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.XAxisField', dm: 'X轴字段' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...edgeOptions],
    },
    yField_edges: {
      title: $i18n.get({ id: 'basic.components.ChartAnalysis.registerMeta.YAxisField', dm: 'Y轴字段' }),
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...edgeOptions],
    },
    ...metas,
  };
};

export default registerMeta;
