import * as CypherQuery from './CypherQuery';
import Engine from './Engine';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';
import * as Neo4jService from './Neo4jService';
import $i18n from '../i18n';

export default {
  id: 'Neo4j',
  name: 'Neo4j',
  title: $i18n.get({ id: 'neo4j.src.services.NeoJEngineService', dm: 'Neo4j 引擎服务' }),
  desc: $i18n.get({ id: 'neo4j.src.services.NeoJComputingEngineAsset', dm: 'GI 团队默认提供的 Neo4j 计算引擎资产包' }),
  type: 'database',
  cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6NRERpsvzMcAAAAAAAAAAAAADmJ7AQ/original',
  group: $i18n.get({ id: 'neo4j.src.services.GVpTeam', dm: 'G6VP 团队' }),
  component: Engine,
  services: {
    ...Initializer,
    ...CypherQuery,
    ...NeighborsQuery,
    ...Neo4jService,
  },
};
