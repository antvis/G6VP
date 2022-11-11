import * as Neo4jService from './Neo4jService';
import * as LanguageQueryService from './LanguageQueryService';
import * as NeighborsQuery from './NeighborsQuery';
import ServerComponent from '../components';
import * as Initializer from './Initializer';

export default {
  id: 'Neo4j',
  name: 'Neo4j',
  title: 'Neo4j 引擎服务',
  desc: 'GI 团队默认提供的 Neo4j 计算引擎资产包',
  type: 'database',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ',
  group: 'GI 团队',
  component: ServerComponent,
  services: {
    ...Initializer,
    ...LanguageQueryService,
    ...NeighborsQuery,
    ...Neo4jService,
  },
};
