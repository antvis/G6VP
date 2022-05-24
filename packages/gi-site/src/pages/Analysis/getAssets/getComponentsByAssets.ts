import { utils } from '@alipay/graphinsight';
import type { TypeAssetInfo } from './typing';
import { getDefaultValues } from './utils';
const { uniqueElementsBy } = utils;

const getAllkeysBySchema = (schema, shapeType) => {
  try {
    if (shapeType === 'node') {
      const nodeKeySet = new Set();
      schema.nodes.forEach(node => {
        Object.keys(node.properties).forEach(k => {
          nodeKeySet.add(k);
        });
      });
      return [...nodeKeySet];
    }
    if (shapeType === 'edge') {
      const edgeKeySet = new Set();
      schema.edges.forEach(edge => {
        Object.keys(edge.properties).forEach(k => {
          edgeKeySet.add(k);
        });
      });
      return [...edgeKeySet];
    }
  } catch (error) {
    return [];
  }
};
/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getComponentsByAssets = (assets, data, services, config, schemaData) => {
  const GI_CONTAINER_INDEXS = Object.values(assets)
    .filter((item: any) => {
      const info = ((item && item.info) || {}) as TypeAssetInfo;
      return (
        info.type === 'GI_CONTAINER_INDEX' || // 这个是兼容 旧的资产info
        info.type === 'GIAC' ||
        info.type === 'GIAC_CONTENT'
      );
    })
    .map(item => {
      const { info } = item as any;
      return {
        label: info.name,
        value: info.id,
      };
    });

  // 集成到右键菜单容器中的组件
  const GI_MENU_CONTAINER_INDEXS = Object.values(assets)
    .filter((item: any) => {
      const info = ((item && item.info) || {}) as TypeAssetInfo;
      return (
        info.type === 'GI_CONTAINER_INDEX' || // 这个是兼容 旧的资产info
        info.type === 'GIAC_MENU' || // 菜单原子组件只能集成到右键菜单组件中
        info.type === 'GIAC' ||
        info.type === 'GIAC_CONTENT'
      );
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
        info = {},
      } = component;
      const keys = getAllkeysBySchema(schemaData, 'node');

      const configObj = registerMeta({
        data,
        keys,
        services,
        config,
        GI_CONTAINER_INDEXS,
        GI_MENU_CONTAINER_INDEXS,
        schemaData,
      });
      //@ts-ignore
      const defaultProps = getDefaultValues({ type: 'object', properties: configObj });

      /** 默认的配置值 */

      const { id, name, category } = info;

      return {
        ...component,
        id,
        name,
        category,
        //@ts-ignore
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
