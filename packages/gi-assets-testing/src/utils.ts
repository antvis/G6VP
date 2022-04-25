import * as GI_BASIC_ASSETS from '@alipay/gi-assets-basic';
import { produce } from 'immer';
import { GI_PROJECT_CONFIG } from './Mock/index';
import type { TestSDKProps } from './TestSDK';

export const getAssetsByType = (type: TestSDKProps['type'], id: string, asset: any) => {
  const nextAssets = produce(GI_BASIC_ASSETS, draft => {
    draft.components[id] = asset;
    if (type === 'NODE' || type === 'EDGE') {
      draft.elements[id] = asset;
    }
    if (type === 'LAYOUT') {
      draft.layouts[id] = asset;
    }
    draft.components[id] = asset;
  });
  return nextAssets;
};

export const getConfigByType = (type: TestSDKProps['type'], id: string, value: any, callback?: (_draft) => any) => {
  const nextConfig = produce(GI_PROJECT_CONFIG, draft => {
    /** 元素资产 */
    if (type === 'NODE') {
      draft.nodes = [
        //@ts-ignore
        {
          id,
          props: value[id],
        },
      ];
      return;
    }
    if (type === 'EDGE') {
      // @ts-ignore
      draft.edges = [
        //@ts-ignore
        {
          id,
          props: value[id],
        },
      ];
      return;
    }
    if (type === 'LAYOUT') {
      draft.layout.id = id;
      draft.layout.props = value[id];
      return;
    }

    /** 组件资产 */
    draft.components.push({
      id,
      props: value[id],
    });
    /** 原子组件 */
    if (type === 'GIAC') {
      const Toolbar = draft.components.find(c => {
        return c.id === 'Toolbar';
      });
      if (Toolbar) {
        Toolbar.props.GI_CONTAINER = [id];
      }
    }
    if (type === 'GIAC_CONTENT') {
      const OperatorBar = draft.components.find(c => {
        return c.id === 'OperatorBar';
      });
      if (OperatorBar) {
        OperatorBar.props.GI_CONTAINER = [id];
      }
    }
    if (type === 'GIAC_MENU') {
      const ContextMenu = draft.components.find(c => {
        return c.id === 'ContextMenu';
      });
      if (ContextMenu) {
        //@ts-ignore
        ContextMenu.props.GI_CONTAINER?.push(id);
      }
    }

    /** 容器组件 */
    if (type === 'GICC') {
      const currentComponent = draft.components.find(item => {
        return item.id === id;
      });
      //@ts-ignore
      currentComponent.props.GI_CONTAINER?.push('ZoomIn', 'ZoomOut', 'FitView');
    }
    if (type === 'GICC_MENU') {
      const currentComponent = draft.components.find(item => {
        return item.id === id;
      });
      //@ts-ignore
      currentComponent.props.GI_CONTAINER?.push('NeighborsQuery');
    }
    if (callback) {
      callback(draft);
    }
  });
  return nextConfig;
};
