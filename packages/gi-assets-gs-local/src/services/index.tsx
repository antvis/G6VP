import * as GremlinQuery from './GremlinQuery';
import * as NeighborsQuery from './NeighborsQuery';
import * as ElementProperties from './ElementProperties';
import * as GraphScopeServices from './GraphScopeService';
import * as ExecAlgorithm from './ExecAlgorithm';
import ServerComponent from './ServerComponent';

export default {
  id: 'GS',
  name: 'GraphScope',
  desc: 'GraphScope 引擎服务',
  component: ServerComponent,
  services: {
    ...GremlinQuery,
    ...NeighborsQuery,
    ...ElementProperties,
    ...ExecAlgorithm,
    ...GraphScopeServices,
  },
};
