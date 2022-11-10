import type { GILayoutAssets, GraphSchemaData } from '@antv/gi-sdk';
import { utils } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import type { TypeAssetInfo } from './typing';

const { getDefaultValues, getKeysByData } = utils;

/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getLayoutsByAssets = (assets: GILayoutAssets, data: GraphinData, schemaData: GraphSchemaData) => {
  const layouts = Object.keys(assets)
    .map(key => {
      const layout = assets[key];
      const {
        registerMeta = () => {
          return {};
        },

        info = { options: {} },
      } = layout;
      const keys = getKeysByData(data, 'node');
      const configObj = registerMeta({ data, keys, schemaData });
      /** 默认的配置值 */
      const defaultProps = getDefaultValues({ type: 'object', properties: configObj });
      const { id, name, category } = info as TypeAssetInfo;
      return {
        ...layout,
        id,
        name,
        category,
        props: {
          ...info.options,
          ...defaultProps,
        },
        meta: {
          ...configObj,
        },
      };
    })
    .reduce((acc, cur) => {
      return {
        ...acc,
        [cur.id]: cur,
      };
    }, {});
  return layouts;
};
export default getLayoutsByAssets;
