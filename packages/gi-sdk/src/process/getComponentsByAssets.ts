import type { GraphinData } from '@antv/graphin';
import type { AssetInfo, GIAC_ITEMS_TYPE, GIComponentAssets, GIConfig, GIService, GraphSchemaData } from '../typing';
import { getDefaultValues } from './common';

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

export const getComponentsByAssets = (
  assets: GIComponentAssets,
  data: GraphinData,
  services: GIService[],
  config: GIConfig,
  schemaData: GraphSchemaData,
  engineId: string,
) => {
  const AUTO_ITEMS: GIAC_ITEMS_TYPE = []; //属于AUTO的组件
  const GIAC_ITEMS: GIAC_ITEMS_TYPE = []; //属于GIAC的组件
  const GIAC_MENU_ITEMS: GIAC_ITEMS_TYPE = []; //属于GIAC的菜单组件
  const GIAC_CONTENT_ITEMS: GIAC_ITEMS_TYPE = []; //属于GIAC的内容组件

  let hasPropertyGraph: boolean = false;
  Object.values(assets).forEach((item: any) => {
    const info = ((item && item.info) || {}) as AssetInfo;
    const { type, id } = info;

    const containerMap = {
      GIAC: GIAC_ITEMS,
      GIAC_MENU: GIAC_MENU_ITEMS,
      GIAC_CONTENT: GIAC_CONTENT_ITEMS,
      AUTO: AUTO_ITEMS,
    };

    if (type in containerMap) {
      containerMap[type].push({ label: info.name, value: info.id });
    }

    if (id === 'PropertyGraphInitializer') {
      hasPropertyGraph = true;
    }
  });
  const GI_CONTAINER_INDEXS = [...GIAC_ITEMS, ...GIAC_CONTENT_ITEMS];

  const components = Object.keys(assets)
    .map(key => {
      const component = assets[key];
      if (!component) {
        console.log('%c !!! 未找到资产包 !!!', 'color:red', key);
        return;
      }
      const {
        registerMeta = () => {
          return {};
        },
        info,
      } = component;
      if (!info) {
        return;
      }
      const keys = getAllkeysBySchema(schemaData, 'node');
      const edgeKeys = getAllkeysBySchema(schemaData, 'edge');

      const configObj = registerMeta({
        data,
        keys,
        edgeKeys,
        services,
        config,
        AUTO_ITEMS,
        GI_CONTAINER_INDEXS,
        GIAC_ITEMS,
        GIAC_MENU_ITEMS,
        GIAC_CONTENT_ITEMS,
        schemaData,
        engineId,
        hasPropertyGraph,
      });

      const { id, name, category, type } = info;

      /** 默认的配置值 */
      const defaultProps = getDefaultValues({ type: 'object', properties: configObj }, type);

      return {
        ...component,
        id,
        name,
        category,
        type: type,
        //@ts-ignore
        props: defaultProps,
        meta: {
          ...configObj,
        },
      };
    })
    .filter(c => c);

  return components;
};
