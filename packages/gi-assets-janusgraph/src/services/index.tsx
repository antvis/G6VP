import Engine from './Engine';
import * as Neo4jService from './EngineService';
import * as CypherQuery from './GremlinQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import $i18n from '../i18n';

export default {
  id: 'JanusGraph',
  name: 'JanusGraph',
  title: $i18n.get({ id: 'janusgraph.src.services.JanusgraphEngineService', dm: 'JanusGraph 引擎服务' }),
  desc: $i18n.get({
    id: 'janusgraph.src.services.TheJanusgraphGraphDataAsset',
    dm: 'G6VP 团队默认提供的 JanusGraph 图数据资产包',
  }),
  type: 'database',
  cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Owq5Tb7HsQsAAAAAAAAAAAAADmJ7AQ/original',
  group: $i18n.get({ id: 'janusgraph.src.services.GVpTeam', dm: 'G6VP 团队' }),
  component: Engine,
  services: {
    ...Initializer,
    ...CypherQuery,
    ...NeighborsQuery,
    ...Neo4jService,
  },
};
