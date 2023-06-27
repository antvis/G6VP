import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const { deepClone, GIAC_METAS } = extra;

const metas = deepClone(GIAC_METAS);
metas.GIAC.properties.GIAC.properties.title.default = $i18n.get({
  id: 'advance.components.AddSheetbar.registerMeta.AddTheSelectedNodesAnd',
  dm: '将选中的节点与边添加到新画布中',
});
metas.GIAC.properties.GIAC.properties.icon.default = 'icon-plus';
metas.GIAC.properties.GIAC.properties.isShowTitle.default = false;
metas.GIAC.properties.GIAC.properties.tooltipPlacement.default = 'right';

const registerMeta = () => {
  return {
    isRelayout: {
      title: $i18n.get({ id: 'advance.components.AddSheetbar.registerMeta.RelayoutOrNot', dm: '是否重新布局' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    ...metas,
  };
};

export default registerMeta;
