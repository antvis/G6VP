import liaoyuan from '../mock/liaoyuan.json';

export class GraphDataBase {
  source: any;
  constructor(s: any) {
    this.source = s;
  }
  graph() {
    return this.source;
  }
}

const { nodes, edges } = liaoyuan.result;
/** 需要标准化 */
const data = {
  nodes: nodes.map(n => {
    return { data: n, id: n.uri }; // 这里需要在数据处理层，让用户自己指定ID
  }),
  edges: edges.map(e => {
    return {
      data: e,
      source: e.fromNodeUri, //这里要么要求用户上传标准的JSON，字段必须用target/source，或者就有一个专门的数据处理中心
      target: e.toNodeUri,
    };
  }),
};

/** 未来 GraphDataBase 可以换成 neo4j 或者 geabase 等数据库服务 */
const db = new GraphDataBase(data);

export const getGraphData = () => {
  return new Promise(resolve => {
    const data = db.graph();

    // 这里需要用户从组件市场里定义初始化逻辑

    const nodes = data.nodes.filter(node => {
      return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
    });
    const edges = getEdgesByNodes(nodes, data.edges);

    return resolve({
      nodes,
      edges,
    }); //这里需要一个规范的图结构
  });
};

export function getEdgesByNodes(nodes, edges) {
  const ids = nodes.map(node => node.id);
  return edges.filter(edge => {
    const { source, target } = edge;
    if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
      return true;
    }
    return false;
  });
}

/** 根据节点获取其一度关系 */
export const getSubGraphData = (ids: string[]) => {
  return new Promise(resolve => {
    const data = db.graph();

    /** Start：组件市场里定义的逻辑;*/

    const propertiesNodes = data.nodes
      .filter(node => {
        return ids.indexOf(node.id) !== -1;
      })
      .map(node => {
        return node.data.properties.map(n => {
          return {
            data: n,
            id: n.uri,
          };
        });
      })
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);

    /**初始化图的节点*/
    const graphOriginNodes = data.nodes.filter(node => {
      return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
    });
    const nodes = [...propertiesNodes, ...graphOriginNodes];
    const edges = getEdgesByNodes(nodes, data.edges);

    /** End：组件市场里定义的逻辑;*/

    return resolve({
      nodes: propertiesNodes,
      edges,
    }); //这里需要一个规范的图结构
  });
};
