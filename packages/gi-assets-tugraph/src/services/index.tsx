import * as CypherQuery from './CypherQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import ServerComponent from './ServerComponent';

export default {
  id: 'TuGraph',
  type: 'database',
  name: 'TuGraph',
  desc: 'TuGraph 引擎服务',
  cover: 'https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ',
  component: ServerComponent,
  services: {
    ...Initializer,
    ...CypherQuery,
    ...NeighborsQuery,
  },
};
