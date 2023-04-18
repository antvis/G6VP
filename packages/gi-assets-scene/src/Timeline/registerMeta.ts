import { extra } from '@antv/gi-sdk';
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
    return { label: key, value: key };
  });

  const edgeOptions = Object.entries(edgeProperties).map(e => {
    const [key, value] = e;
    return { label: key, value: key };
  });
  return {
    height: {
      title: '画布高度',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      type: 'number',
      default: 400,
    },
    dateKey: {
      title: '时间字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...edgeOptions],
    },

    dataType: {
      title: '数据类型',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { value: 'nodes', label: '节点数据' },
        { value: 'edges', label: '边数据' },
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
      title: 'X轴字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...nodeOptions],
    },
    yField_nodes: {
      title: 'Y轴字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...nodeOptions],
    },
    xField_edges: {
      title: 'X轴字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...edgeOptions],
    },
    yField_edges: {
      title: 'Y轴字段',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [...edgeOptions],
    },
    ...metas,
  };
};

export default registerMeta;
