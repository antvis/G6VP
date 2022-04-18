/** export  */
import { deepClone, GIAC_CONTENT_METAS, GIAC_CONTENT_PROPS, GIAC_METAS, GIAC_PROPS } from './components/const';
import GIAComponent from './components/GIAC';
import { useContext } from './context';
import GISDK from './GISDK';
import * as utils from './utils';
/** export typing */
export { default as useGraphInsightContainerLayout } from './process/layout';
export type { GIAssets, GIComponentConfig, GIConfig, GIEdgeConfig, GINodeConfig } from './typing';
export { useContext, utils };
export { extra };
const extra = {
  GIAC_CONTENT_METAS,
  GIAC_CONTENT_PROPS,
  GIAC_METAS,
  GIAC_PROPS,
  deepClone,
  GIAComponent,
};
const version = '2.0.0';
console.log(`%c GI_VERSION:${version}`, 'color:red');

export default GISDK;
