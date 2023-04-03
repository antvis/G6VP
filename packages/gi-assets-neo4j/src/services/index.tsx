import ServerComponent from '../components';
import * as CypherQuery from './CypherQuery';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import * as Neo4jService from './Neo4jService';

export default {
  id: 'Neo4j',
  name: 'Neo4j',
  title: 'Neo4j 引擎服务',
  desc: 'GI 团队默认提供的 Neo4j 计算引擎资产包',
  type: 'database',
  cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6NRERpsvzMcAAAAAAAAAAAAADmJ7AQ/original',
  group: 'G6VP 团队',
  component: ServerComponent,
  services: {
    ...Initializer,
    ...CypherQuery,
    ...NeighborsQuery,
    ...Neo4jService,
  },
} as any;
