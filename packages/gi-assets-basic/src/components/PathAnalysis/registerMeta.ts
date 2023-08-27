import { NodeSelectionMode } from '@antv/gi-common-components/lib/NodeSelectionWrap';
import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';
import info from './info';
const { deepClone, GIAC_CONTENT_METAS } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.containerWidth.default = '400px';

const nodeSelectionOption = [
  {
    value: NodeSelectionMode.List,
    label: $i18n.get({ id: 'basic.components.PathAnalysis.registerMeta.ListAcquisition', dm: '列表获取' }),
  },
  {
    value: NodeSelectionMode.Canvas,
    label: $i18n.get({ id: 'basic.components.PathAnalysis.registerMeta.CanvasPickup', dm: '画布拾取' }),
  },
];

const nodeSelectionDefaultValue = nodeSelectionOption.map(item => item.value);

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
    nodeSelectionMode: {
      title: $i18n.get({ id: 'basic.components.PathAnalysis.registerMeta.ObtainNodeMode', dm: '获取节点模式' }),
      type: 'array',
      enum: nodeSelectionOption,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: nodeSelectionDefaultValue,
    },
    pathNodeLabel: {
      title: $i18n.get({ id: 'basic.components.PathAnalysis.registerMeta.TagMapping', dm: '标签映射' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: options,
      default: 'id',
    },
    hasDirection: {
      title: $i18n.get({ id: 'basic.components.PathAnalysis.registerMeta.IsThereAnyDirection', dm: '是否有向' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    hasMaxDeep: {
      title: $i18n.get({ id: 'basic.components.PathAnalysis.registerMeta.MaximumDepth', dm: '是否有最大深度' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    ...metas,
  };
};

export default registerMeta;
