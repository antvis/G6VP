// import ServerComponent from '../components';
import * as ElementProperties from './ElementProperties';
import Engine from './Engine';
import * as GremlinQuery from './GremlinQuery';
import * as HugeGraphService from './HugeGraphService';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import $i18n from '../i18n';

export default {
  id: 'HugeGraph',
  name: 'HugeGraph',
  title: $i18n.get({ id: 'hugegraph.src.services.HugegraphEngineService', dm: 'HugeGraph 引擎服务' }),
  desc: $i18n.get({
    id: 'hugegraph.src.services.HugegraphComputingEngineAssetPackage',
    dm: 'GI 团队默认提供的 HugeGraph 计算引擎资产包',
  }),
  type: 'database',
  cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6NRERpsvzMcAAAAAAAAAAAAADmJ7AQ/original',
  group: $i18n.get({ id: 'hugegraph.src.services.GVpTeam', dm: 'G6VP 团队' }),
  component: Engine, //ServerComponent,
  services: {
    ...Initializer,
    ...GremlinQuery,
    ...NeighborsQuery,
    ...HugeGraphService,
    ...ElementProperties,
  },
};
