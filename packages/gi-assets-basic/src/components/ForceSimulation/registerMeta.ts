import { extra } from '@alipay/graphinsight';
import info from './info';
const { deepClone, GIAC_METAS } = extra;
const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = info.name;
metas.GIAC.properties.GIAC.properties.icon.default = info.icon;
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

export default () => {
  return {
    autoPin: {
      title: '固定拖拽后的节点',
      type: 'boolean',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      default: true,
    },
    dragNodeMass: {
      title: '固定的质量',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      type: 'number',
      default: 10000000000,
    },
    ...metas,
  };
};
