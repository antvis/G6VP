import { GIGraphData, ServiceObject } from '@alipay/graphinsight';

export interface ReqNeighborsQuery {
  //扩散的节点，是个节点ID数组
  ids: string[];
  //扩散的节点的全部信息
  nodes: any[];
  //扩散的度数
  sep: number;
}
export interface ResNeighborsQuery {
  //扩散的节点，是个节点ID数组
  ids: string[];
  //扩散的节点的全部信息
  nodes: any[];
  //扩散的度数
  sep: number;
}

export const NeighborsQuery: ServiceObject = {
  name: '邻居查询',
  method: 'POST',
  req: `
  export interface ReqNeighborsQuery {
    //扩散的节点，是个节点ID数组
    ids: string[];
    //扩散的节点的全部信息
    nodes: any[];
    //扩散的度数
    sep: number;
  }  
  `,
  res: `
  export interface GIGraphData {
    nodes: {
      // 节点ID
      id: string;
      // 节点类型的枚举值。Property Graph 也称之为 node.label
      nodeType: string;
      // 业务数据,注意需要打平,暂不支持嵌套
      data: {};
      // 业务数据（data）中的哪个字段，用来映射节点类型
      nodeTypeKeyFromProperties?: string;
    }[];
    edges: {
      // 边ID
      id: string;
      // 边关联的 source 节点ID
      source: string;
      // 边关联的 target 节点ID
      target: string;
      // 边类型的枚举值。Property Graph 也称之为 edge.label
      edgeType: string;
      // 业务数据,注意需要打平,暂不支持嵌套
      data: {};
      // 业务数据（data）中的哪个字段，用来映射边类型
      edgeTypeKeyFromProperties?: string;
    }[];
  }
  `,

  service: (params: ReqNeighborsQuery): Promise<GIGraphData> => {
    const { ids, nodes: NODES } = params;

    const transfrom = p => {
      const { nodes, edges } = p;
      return {
        nodes: nodes.map(c => {
          return {
            id: c.id,
            nodeType: c.nodeType,
            data: c,
          };
        }),
        edges: edges.map((c, index) => {
          return {
            source: c.source,
            target: c.target,
            id: `${c.source}-${c.target}-${index}`,
            data: c,
            edgeType: 'UNKOWN',
          };
        }),
      };
    };
    const datas = NODES.map(node => {
      const { id, nodeType } = node;
      return {
        nodes: [
          {
            id,
            nodeType,
          },
          {
            id: `${id}-1`,
            nodeType,
          },
          {
            id: `${id}-2`,
            nodeType,
          },
          {
            id: `${id}-3`,
            nodeType,
          },
        ],
        edges: [
          {
            source: id,
            target: `${id}-1`,
          },
          {
            source: id,
            target: `${id}-2`,
          },
          {
            source: id,
            target: `${id}-3`,
          },
        ],
      };
    }).reduce(
      (acc, curr) => {
        return {
          //@ts-ignore
          nodes: [].concat(acc.nodes, curr.nodes),
          //@ts-ignore
          edges: [].concat(acc.edges, curr.edges),
        };
      },
      { nodes: [], edges: [] },
    );
    return new Promise(resolve => {
      return resolve(transfrom(datas));
    });
  },
};
