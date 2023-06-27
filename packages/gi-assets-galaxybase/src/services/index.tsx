import * as CypherQuery from './CypherQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import ServerComponent from './ServerComponent';
import $i18n from '../i18n';
export default {
  id: 'Galaxybase',
  type: 'database',
  name: 'Galaxybase',
  desc: $i18n.get({ id: 'galaxybase.src.services.GalaxybaseEngineService', dm: 'Galaxybase 引擎服务' }),
  cover: 'https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ',
  component: ServerComponent,
  services: {
    ...Initializer,
    ...CypherQuery,
    ...NeighborsQuery,
  },
} as any;
