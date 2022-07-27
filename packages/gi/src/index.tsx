/** export  */
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
export type { IGIAC } from './components/const';
export { default as Icon } from './components/Icon';
/** export typing */
export { default as useGraphInsightContainerLayout } from './process/layout';
export { COLORS, IEdgeSchema, INodeSchema } from './process/schema';
export type { EngineServer } from './process/services';
export type {
  AssetCategory,
  AssetInfo,
  AssetType,
  GIAssets,
  GIComponentConfig,
  GIConfig,
  GIEdgeConfig,
  GIGraphData,
  GIGraphSchema,
  GINodeConfig,
  GIService,
  ISourceDataMap,
  ServiceObject,
} from './typing';
export { useContext, utils };
export { extra };

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

const version = '2.7.0';
console.log(`%c GI_VERSION:${version}`, 'color:red');

export default GISDK;
