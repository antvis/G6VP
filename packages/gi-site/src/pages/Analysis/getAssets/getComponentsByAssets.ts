import { extractDefault } from '@ali/react-datav-gui-utils';
import { getKeysByData } from './utils';
/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getComponentsByAssets = (assets, data, services, config) => {
  const GI_CONTAINER_INDEXS = Object.values(assets)
    .filter(item => {
      const { info } = item || ({ info: {} } as any);
      return info.type === 'GI_CONTAINER_INDEX';
    })
    .map(item => {
      const { info } = item as any;
      return {
        label: info.name,
        value: info.id,
      };
    });

  const components = Object.keys(assets)
    .map(key => {
      const component = assets[key];
      if (!component) {
        return {
          id: 'NOT_FOUND',
          name: key,
        };
      }
      const {
        registerMeta = () => {
          return {};
        },
        Component,
        info = {},
      } = component;
      const keys = getKeysByData(data);

      const configObj = registerMeta({ data, keys, services, config, GI_CONTAINER_INDEXS });
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
    })
    .filter(c => {
      if (c.id === 'NOT_FOUND') {
        console.log('%c !!! 未找到资产包 !!! ', 'color:red', c.name);
      }
      return c.id !== 'NOT_FOUND';
    });

  return components;
};
export default getComponentsByAssets;
