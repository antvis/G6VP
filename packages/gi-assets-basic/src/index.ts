import * as components from './components';
import { extra as GIExtra } from '@alipay/graphinsight';
const  { GIAC_CONTENT_METAS, GIAC_CONTENT_PROPS, GIAC_METAS, GIAC_PROPS, GIAComponent } = GIExtra;

import * as elements from './elements';
import * as layouts from './layouts';

const extra = {
  GIAComponent,
  GIAC_CONTENT_METAS,
  GIAC_METAS,
  GIAC_PROPS,
  GIAC_CONTENT_PROPS,
};

export { components, elements, layouts, extra };
