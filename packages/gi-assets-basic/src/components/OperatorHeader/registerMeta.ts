import { extra } from '@antv/gi-sdk';
import $i18n from '../../i18n';
const { deepClone, GI_CONTAINER_METAS } = extra;
const metas = deepClone(GI_CONTAINER_METAS);
//@ts-ignore
metas.gap = {
  name: $i18n.get({ id: 'basic.components.OperatorHeader.registerMeta.Interval', dm: '间隔' }),
  type: 'text',
  default: '0px',
};
const registerMeta = context => {
  const { GI_CONTAINER_INDEXS = [] } = context;
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: $i18n.get({ id: 'basic.components.OperatorHeader.registerMeta.IntegratedComponents', dm: '集成组件' }),
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
    },
    leftContainer: {
      name: $i18n.get({ id: 'basic.components.OperatorHeader.registerMeta.LeftComponent', dm: '左侧组件' }),
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    centerContainer: {
      name: $i18n.get({ id: 'basic.components.OperatorHeader.registerMeta.IntermediateComponent', dm: '中间组件' }),
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    rightContainer: {
      name: $i18n.get({ id: 'basic.components.OperatorHeader.registerMeta.RightComponent', dm: '右侧组件' }),
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    ...metas,
  };
};

export default registerMeta;
