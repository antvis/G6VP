import Lockr from 'lockr';
import demo from '../../mock/demo.json';
import enterprise from '../../mock/enterprise.json';
import liaoyuan from '../../mock/liaoyuan.json';
import { defaultConfig } from './defaultConfig';
const { GIConfig } = defaultConfig;
/**
 * 数据的预处理
 * 不同的数据，需要不同的预处理函数，最终转化为标准的GI图数据格式
 */
const transform = {
  liaoyuan: source => {
    const { nodes, edges } = source;
    return {
      nodes: nodes.map(n => {
        return { data: n, id: n.uri }; // 这里需要在数据处理层，让用户自己指定ID
      }),
      edges: edges.map(e => {
        return {
          data: e,
          source: e.fromNodeUri,
          target: e.toNodeUri,
        };
      }),
    };
  },
  demo: source => {
    const { nodes, edges } = source;
    return {
      nodes: nodes.map(n => {
        return { data: n, id: n.id };
      }),
      edges: edges.map(e => {
        return {
          data: e,
          source: e.source,
          target: e.target,
        };
      }),
    };
  },
  wangshang: source => {
    const { nodes, edges } = source;
    return {
      nodes: nodes.map(n => {
        return { data: n, id: n.id };
      }),
      edges,
    };
  },
};

/**
 * TODO：用户上传MockJSON到数据库中，这里我们用本地的localstorage来存储
 * 加前缀
 */
Lockr.prefix = 'gi_';
/** 统一的执行函数 */
const storeData = (projectId, data) => {
  Lockr.set(projectId, transform[projectId](data));
};
// Lockr.set('project', [
//   /**
//    * 如果选择了解决方案，则config设置为解决方案的Config
//    */
//   {
//     id: 'liaoyuan',
//     title: '燎原计划',
//     config: {
//       ...GIConfig,
//       components: [
//         ...GIConfig.components,
//         {
//           id: 'Liaoyuan-Click-Entity-Node',
//           meta: {},
//           props: {},
//           enable: true,
//         },
//         {
//           id: 'Liaoyuan-Click-Event-Node',
//           meta: {},
//           props: {},
//           enable: true,
//         },
//       ],
//       layout: {
//         id: 'dagre', //'graphin-force',
//         options: {
//           rankdir: 'LR', // 可选，默认为图的中心
//           align: undefined, // 可选
//           nodesep: 15, // 可选
//           ranksep: 40, // 可选
//         },
//       },
//     },
//   },
//   { id: 'demo', title: '演示案例', config: GIConfig },
//   {
//     id: 'wangshang',
//     title: '网商企业图谱',
//     config: {
//       ...GIConfig,
//       components: [
//         {
//           id: 'Legend',
//           props: {
//             sortKey: 'entityTypeName', //TODO:这里Graphin的Legend没有做异常处理，如果sortKey不对的话
//           },
//           meta: {},
//           enable: true,
//         },
//       ],
//     },
//   },
// ]);

storeData('liaoyuan', { nodes: liaoyuan.result.nodes, edges: liaoyuan.result.edges });
storeData('demo', { nodes: demo.nodes, edges: demo.edges });
storeData('wangshang', { nodes: enterprise.graphData.nodes, edges: enterprise.graphData.edges });

/** 设置默认的配置项 */
Lockr.set('defaultConfig', GIConfig);

// console.log(localStorage.getItem('gi_liaoyuan'));
// console.log(Lockr.get('liaoyuan'));
