import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
import { NodeSelectionMode } from '@antv/gi-common-components/lib/NodeSelectionWrap';
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
    ...metas,
  };
};

export default registerMeta;
