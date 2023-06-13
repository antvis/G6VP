import Engine from './Engine';
import * as Neo4jService from './EngineService';
import * as CypherQuery from './GremlinQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';

export default {
  id: 'JanusGraph',
  name: 'JanusGraph',
  title: 'JanusGraph 引擎服务',
  desc: 'G6VP 团队默认提供的 JanusGraph 图数据资产包',
  type: 'database',
  cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Owq5Tb7HsQsAAAAAAAAAAAAADmJ7AQ/original',
  group: 'G6VP 团队',
  component: Engine,
  services: {
    ...Initializer,
    ...CypherQuery,
    ...NeighborsQuery,
    ...Neo4jService,
  },
};
