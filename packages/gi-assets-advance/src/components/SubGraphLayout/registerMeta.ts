import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';

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
      title: $i18n.get({
        id: 'advance.components.SubGraphLayout.registerMeta.DefaultSubgraphPartition',
        dm: '默认子图划分',
      }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    sortKey: {
      title: $i18n.get({ id: 'advance.components.SubGraphLayout.registerMeta.MappingField', dm: '映射字段' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: keys,
      default: nodeTypeKeyFromProperties || '',
    },
    gap: {
      title: $i18n.get({ id: 'advance.components.SubGraphLayout.registerMeta.SubgraphSpacing', dm: '子图间距' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 0,
        max: 1000,
      },
      default: 200,
    },
    direction: {
      title: $i18n.get({
        id: 'advance.components.SubGraphLayout.registerMeta.SubgraphArrangementDirection',
        dm: '子图排列方向',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        {
          value: 'vertical',
          label: $i18n.get({ id: 'advance.components.SubGraphLayout.registerMeta.Vertical', dm: '垂直' }),
        },
        {
          value: 'horizontal',
          label: $i18n.get({ id: 'advance.components.SubGraphLayout.registerMeta.Horizontal', dm: '水平' }),
        },
      ],

      default: 'horizontal',
    },
    ...metas,
  };
};
