import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);

const { width, offset, placement } = metas;

width.default = '350px';
offset.default = [0, 2];

const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [] } = context;

  const schema = {
    GI_CONTAINER: {
      title: $i18n.get({ id: 'basic.components.SideSelectTabs.registerMeta.IntegratedComponents', dm: '集成组件' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      enum: GIAC_CONTENT_ITEMS,
      default: [],
    },
    width,
    offset,
    placement: {
      title: $i18n.get({ id: 'basic.components.SideSelectTabs.registerMeta.PlacementOrientation', dm: '放置方位' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LB',
            label: $i18n.get({ id: 'basic.components.SideSelectTabs.registerMeta.LowerLeftLeft', dm: '左下 / left' }),
          },
        ],
      },
      default: 'LB',
    },
  };

  return schema;
};

export default registerMeta;
