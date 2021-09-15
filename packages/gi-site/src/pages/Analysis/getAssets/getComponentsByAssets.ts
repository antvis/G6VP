import { extractDefault } from '@ali/react-datav-gui-utils';
import { getKeysByData } from './utils';
/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getComponentsByAssets = (assets, data, services, config) => {
  const components = Object.keys(assets).map(key => {
    const component = assets[key];
    const {
      registerMeta = () => {
        return {};
      },
      Component,
      info = {},
    } = component;
    const keys = getKeysByData(data);
    const configObj = registerMeta({ data, keys, services, config });
    /** 默认的配置值 */
    const defaultProps = extractDefault({ config: configObj, value: {} });
    const { id, name, category } = info;
    return {
      id,
      name,
      category,
      props: defaultProps,
      meta: {
        ...configObj,
      },
    };
  });
  return components;
};
export default getComponentsByAssets;
