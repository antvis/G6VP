import ServerComponent from '../components/ServerComponent';
import * as ElementProperties from './ElementProperties';
import * as ExecAlgorithm from './ExecAlgorithm';
import * as GremlinQuery from './GremlinQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import $i18n from '../i18n';

export default {
  id: 'GraphScope',
  name: 'GraphScope',
  title: $i18n.get({
    id: 'graphscope.src.services.GraphscopeStandaloneEngineService',
    dm: 'GraphScope 单机版引擎服务',
  }),
  desc: $i18n.get({
    id: 'graphscope.src.services.TheStandaloneComputingEngineLaunched',
    dm: 'GraphScope 团队推出的单机版计算引擎。包含运维管理，集群管理，数据管理，部署概览等资产模块',
  }),
  type: 'database',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ',
  group: $i18n.get({ id: 'graphscope.src.services.GraphscopeTeam', dm: 'GraphScope 团队' }),
  component: ServerComponent,
  services: {
    ...Initializer,
    ...GremlinQuery,
    ...NeighborsQuery,
    ...ElementProperties,
    ...ExecAlgorithm,
  },
};
