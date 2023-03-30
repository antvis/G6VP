import ServerComponent from '../components/ServerComponent';
import * as ElementProperties from './ElementProperties';
import * as ExecAlgorithm from './ExecAlgorithm';
import * as GremlinQuery from './GremlinQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';

export default {
  id: 'GraphScope',
  name: 'GraphScope',
  title: 'GraphScope 单机版引擎服务',
  desc: 'GraphScope 团队推出的单机版计算引擎。包含运维管理，集群管理，数据管理，部署概览等资产模块',
  type: 'database',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ',
  group: 'GraphScope 团队',
  component: ServerComponent,
  services: {
    ...Initializer,
    ...GremlinQuery,
    ...NeighborsQuery,
    ...ElementProperties,
    ...ExecAlgorithm,
  },
};
