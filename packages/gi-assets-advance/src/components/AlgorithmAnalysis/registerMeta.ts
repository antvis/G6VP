import { extra } from '@alipay/graphinsight';
import info from './info';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;

export const SchemaData = {
  name: {
    type: 'string',
    title: '算法类型',
    'x-decorator': 'FormItem',
    'x-component': 'Select',
    enum: [{ label: 'PageRank', value: 'pagerank' }, { label: '单源最短路径', value: 'sssp' }],
    'x-reactions': [
      {
        target: 'sortById',
        fulfill: {
          state: {
            visible: '{{$self.value === "pagerank"}}',
          },
        },
      },
    ],
  },
  limit: {
    title: '限制数量',
    type: 'number',
    'x-decorator': 'FormItem',
    'x-component': 'NumberPicker',
    default: 100,
  },
  sortById: {
    type: 'boolean',
    title: '是否根据ID排序',
    'x-decorator': 'FormItem',
    'x-component': 'Switch',
    default: true,
  },
  maxRound: {
    title: 'maxRound',
    type: 'number',
    'x-decorator': 'FormItem',
    'x-component': 'NumberPicker',
    default: 1,
  },
  weight: {
    title: '权重',
    type: 'number',
    'x-decorator': 'FormItem',
    'x-component': 'NumberPicker',
    default: 1,
  },
  tolerance: {
    title: 'tolerance',
    type: 'number',
    'x-decorator': 'FormItem',
    'x-component': 'NumberPicker',
    default: 1,
  },
};

const registerMeta = context => {
  const { services } = context;
  const serviceOptions = services.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });

  return {
    serviceId: {
      title: '数据服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: serviceOptions,
      },
      default: 'Mock/GremlinQuery',
    },
    ...SchemaData,
    ...metas,
  };
};

export default registerMeta;
