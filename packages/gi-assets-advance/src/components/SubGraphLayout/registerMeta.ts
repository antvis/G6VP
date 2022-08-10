import { extra } from '@alipay/graphinsight';
import info from './info';

const { GIAC_CONTENT_METAS, deepClone } = extra;

const metas = deepClone(GIAC_CONTENT_METAS);

metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.tooltip.default = info.desc;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

export default ({ keys, schemaData }) => {
  const nodeTypeKeyFromProperties = schemaData.nodes[0]?.nodeTypeKeyFromProperties;
  return {
    isDefaultSubGraph: {
      title: '默认子图划分',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    sortKey: {
      title: '映射字段',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: keys,
      default: nodeTypeKeyFromProperties || '',
    },
    ...metas,
  };
};
