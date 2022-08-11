import type { GIAC_ITEMS_TYPE, GIComponentAssets, GIConfig, GIService, GraphSchemaData } from '@alipay/graphinsight';
import { utils } from '@alipay/graphinsight';
import { GraphinData } from '@antv/graphin';
import type { TypeAssetInfo } from './typing';

const { getDefaultValues } = utils;

const getAllkeysBySchema = (schema, shapeType): string[] => {
  try {
    if (shapeType === 'node') {
      const nodeKeySet = new Set<string>();
      schema.nodes.forEach(node => {
        Object.keys(node.properties).forEach(k => {
          nodeKeySet.add(k);
        });
      });
      return [...nodeKeySet];
    }
    if (shapeType === 'edge') {
      const edgeKeySet = new Set<string>();
      schema.edges.forEach(edge => {
        Object.keys(edge.properties).forEach(k => {
          edgeKeySet.add(k);
        });
      });
      return [...edgeKeySet];
    }
  } catch (error) {}
  return [];
};
/**
 *
 * @param assets 服务端拿到的资产: Components
 * @param data 图数据
 * @returns
 */
const getComponentsByAssets = (
  assets: GIComponentAssets,
  data: GraphinData,
  services: GIService[],
  config: GIConfig,
  schemaData: GraphSchemaData,
  engineId: string,
) => {
  const GIAC_ITEMS: GIAC_ITEMS_TYPE = []; //属于GIAC的组件
  const GIAC_MENU_ITEMS: GIAC_ITEMS_TYPE = []; //属于GIAC的菜单组件
  const GIAC_CONTENT_ITEMS: GIAC_ITEMS_TYPE = []; //属于GIAC的内容组件

  Object.values(assets).forEach((item: any) => {
    const info = ((item && item.info) || {}) as TypeAssetInfo;
    const { type } = info;
    if (type === 'GIAC') {
      GIAC_ITEMS.push({
        label: info.name,
        value: info.id,
      });
    }
    if (type === 'GIAC_MENU') {
      GIAC_MENU_ITEMS.push({
        label: info.name,
        value: info.id,
      });
    }
    if (type === 'GIAC_CONTENT') {
      GIAC_CONTENT_ITEMS.push({
        label: info.name,
        value: info.id,
      });
    }
  });
  const GI_CONTAINER_INDEXS = [...GIAC_ITEMS, ...GIAC_CONTENT_ITEMS];

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
        info,
      } = component;
      const keys = getAllkeysBySchema(schemaData, 'node');
      const edgeKeys = getAllkeysBySchema(schemaData, 'edge');

      const configObj = registerMeta({
        data,
        keys,
        edgeKeys,
        services,
        config,
        GI_CONTAINER_INDEXS,
        GIAC_ITEMS,
        GIAC_MENU_ITEMS,
        GIAC_CONTENT_ITEMS,
        schemaData,
        engineId,
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
