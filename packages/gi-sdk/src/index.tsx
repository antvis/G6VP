import pkg from '../package.json';
import {
  deepClone,
  GI_CONTAINER_METAS,
  GIAC_CONTENT_METAS,
  GIAC_CONTENT_PROPS,
  GIAC_METAS,
  GIAC_PROPS,
} from './components/const';
import GIAComponent from './components/GIAC';
export { Icon, icons } from '@antv/gi-common-components';
export { Compatible, registerBehavior } from '@antv/graphin';
export { default as CollapseCard } from './components/CollapseCard';
export type { IGIAC } from './components/const';
export { default as EngineBanner } from './components/EngineBanner';
export { default as EngineServer } from './components/EngineServer';
/** default assets */
export { default as Initializer } from './components/Initializer';
export { default as SimpleEdge } from './components/SimpleEdge';
export { default as SimpleNode } from './components/SimpleNode';
/** default assets */
export { default as Studio } from './components/Studio';
export { Info } from './constants/info';
export { useComponents } from './hooks/useComponents';
export { default as useContainer } from './hooks/useContainer';
export { Shortcuts, useShortcuts } from './utils';
export { common };

import template from './constants/template';
import { useContext } from './context';
import GISDK from './GISDK';
import * as utils from './process';
import { createDownload } from './utils';
const { version } = pkg;
console.log(`%c 🎉 GI_SDK_VERSION:${version}`, 'color:#3e5dff');
const extra = {
  /** 原子组件 META */
  GIAC_CONTENT_METAS,
  GIAC_CONTENT_PROPS,
  GIAC_METAS,
  GIAC_PROPS,
  /** 容器组件 META */
  GI_CONTAINER_METAS,
  deepClone,
  GIAComponent,
};
const common = {
  createDownload,
};

// export { default as Icon } from './components/Icon';

/** export typing */

export { changeLanguage, formatMessage, getCurrentLanguage, LANGUAGE_KEY_NAME } from './process/locale';
export { COLORS } from './process/schema';
export type { IEdgeSchema, IGraphData, INodeSchema } from './process/schema';
export type {
  AssetCategory,
  AssetInfo,
  AssetType,
  ComponentAsset,
  GIAC_ITEMS_TYPE,
  GIAssets,
  GIComponentAssets,
  GIComponentConfig,
  GIConfig,
  GIEdgeConfig,
  GIElementsAssets,
  GIGraphData,
  GIGraphSchema,
  GILayoutAssets,
  GILayoutConfig,
  GINodeConfig,
  GIService,
  GISiteParams,
  GraphSchemaData,
  ISourceDataMap,
  ServiceObject,
} from './typing';
export { extra, template, useContext, utils, version };
declare global {
  interface Window {
    GISDK: {
      (): typeof GISDK;
      default: typeof GISDK;
      extra: typeof extra;
      template: typeof template;
      useContext: typeof useContext;
      utils: typeof utils;
      version: typeof version;
    };
  }
}

export default GISDK;
