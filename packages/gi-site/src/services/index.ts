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
    return resolve(data); //这里需要一个规范的图结构
  });
};
