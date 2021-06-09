import Lockr from 'lockr';
import demo from '../../mock/demo.json';
import liaoyuan from '../../mock/liaoyuan.json';

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

storeData('liaoyuan', { nodes: liaoyuan.result.nodes, edges: liaoyuan.result.edges });
storeData('demo', { nodes: demo.nodes, edges: demo.edges });

// console.log(localStorage.getItem('gi_liaoyuan'));
// console.log(Lockr.get('liaoyuan'));
