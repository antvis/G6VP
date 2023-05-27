// import ServerComponent from '../components';
import * as ElementProperties from './ElementProperties';
import Engine from './Engine';
import * as GremlinQuery from './GremlinQuery';
import * as HugeGraphService from './HugeGraphService';
import * as Initializer from './Initializer';
import * as NeighborsQuery from './NeighborsQuery';

export default {
  id: 'HugeGraph',
  name: 'HugeGraph',
  title: 'HugeGraph 引擎服务',
  desc: 'GI 团队默认提供的 HugeGraph 计算引擎资产包',
  type: 'database',
  cover: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*6NRERpsvzMcAAAAAAAAAAAAADmJ7AQ/original',
  group: 'G6VP 团队',
  component: Engine, //ServerComponent,
  services: {
    ...Initializer,
    ...GremlinQuery,
    ...NeighborsQuery,
    ...HugeGraphService,
    ...ElementProperties,
  },
};
