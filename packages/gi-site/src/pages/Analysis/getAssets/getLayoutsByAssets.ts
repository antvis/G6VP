import { extractDefault } from '@ali/react-datav-gui-utils';
import { getKeysByData } from './utils';
/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getLayoutsByAssets = (assets, data, services, config) => {
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
      const configObj = registerMeta({ data, keys, services, config });
      /** 默认的配置值 */
      const defaultProps = extractDefault({ config: configObj, value: {} });
      const { id, name, category } = info;
      return {
        id,
        name,
        category,
        props: { ...info.options, ...defaultProps },
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
