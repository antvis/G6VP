/** export  */
const version = '2.0.2';
console.log(`%c 🎉 GI_SDK_VERSION:${version}`, 'color:#3e5dff');
import {
  deepClone,
  GIAC_CONTENT_METAS,
  GIAC_CONTENT_PROPS,
  GIAC_METAS,
  GIAC_PROPS,
  GI_CONTAINER_METAS,
} from './components/const';
import GIAComponent from './components/GIAC';
import { useContext } from './context';
import GISDK from './GISDK';
import * as utils from './process';

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

export { Icon } from '@antv/gi-common-components';
export { default as CollapseCard } from './components/CollapseCard';
export type { IGIAC } from './components/const';
export { default as EngineBanner } from './components/EngineBanner';
export { default as EngineServer } from './components/EngineServer';
// export { default as Icon } from './components/Icon';
/** export typing */
export { COLORS, IEdgeSchema, INodeSchema } from './process/schema';
export type {
  AssetCategory,
  AssetInfo,
  AssetType,
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
export { useContext, utils, version };
export { extra };

export default GISDK;
