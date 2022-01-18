import { produce } from 'immer';
import BarA from './BarA';
import ContextMenu from './ContextMenu';
import MenuA from './MenuA';
import { assets as MockAssets, config as MockConfig } from './mock';
import OperatorBar from './OperatorBar';
import type { TestSDKProps } from './TestSDK';

export const getAssetsByType = (type: TestSDKProps['type'], id: string, asset: any) => {
  const nextAssets = produce(MockAssets, draft => {
    draft.components[id] = asset;

    if (type === 'GIAC_CONTENT') {
      draft.components['OperatorBar'] = OperatorBar;
    }
    if (type === 'GIAC_MENU') {
      draft.components['ContextMenu'] = ContextMenu;
    }
    if (type === 'GICC') {
      draft.components['BarA'] = BarA;
    }
    if (type === 'GICC_MENU') {
      draft.components['MenuA'] = MenuA;
    }
  });
  return nextAssets;
};

export const getConfigByType = (type: TestSDKProps['type'], id: string, value: any) => {
  const nextConfig = produce(MockConfig, draft => {
    draft.components.push({
      id,
      props: value[id],
    });

    if (type === 'GIAC_CONTENT') {
      draft.components.push({
        id: 'OperatorBar',
        props: {
          GI_CONTAINER: [id],
        },
      });
    }
    if (type === 'GIAC_MENU') {
      draft.components.push({
        id: 'ContextMenu',
        props: {
          GI_CONTAINER: [id],
        },
      });
    }
    if (type === 'GICC') {
      draft.components.push({
        id: 'BarA',
        props: {
          GIAC_CONTENT: {
            title: '测试组件A',
          },
        },
      });
      draft.components
        .find(item => {
          return item.id === id;
        })
        ?.props?.GI_CONTAINER?.push('BarA');
    }
    if (type === 'GICC_MENU') {
      draft.components.push({
        id: 'MenuA',
        props: {},
      });
      const match = draft.components.find(item => {
        return item.id === id;
      });
      if (match) {
        match?.props?.GI_CONTAINER?.push('MenuA');
      }
    }
  });
  return nextConfig;
};
