import * as ElementProperties from './ElementProperties';
import * as ExecAlgorithm from './ExecAlgorithm';
import * as GraphScopeServices from './GraphScopeService';
import * as GremlinQuery from './GremlinQuery';
import * as NeighborsQuery from './NeighborsQuery';
import ServerComponent from './ServerComponent';

export default {
  id: 'GS_Standalone',
  name: 'GraphScope Standalone',
  title: 'GraphScope 单机版引擎服务',
  desc: 'GraphScope 团队推出的单机版计算引擎。包含运维管理，集群管理，数据管理，部署概览等资产模块',
  type: 'database',
  cover: 'https://gw-office.alipayobjects.com/bmw-prod/600dccb9-f47b-4c79-acdd-4ae9dff64261.png',
  group: 'GraphScope 团队',
  component: ServerComponent,
  services: {
    ...GremlinQuery,
    ...NeighborsQuery,
    ...ElementProperties,
    ...ExecAlgorithm,
    ...GraphScopeServices,
  },
};
