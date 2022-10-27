import { ServiceObject } from '@alipay/graphinsight';

export interface NeighborsQueryParams {
  ids: string[]; //扩散的节点，是个节点ID数组
  sep: number; //扩散的度数
  nodes: any[]; //扩散的节点的全部信息
}

export const NeighborsQuery: ServiceObject = {
  name: '邻居查询',
  method: 'POST',
  req: `
  {
    ids: string[]; //扩散的节点，是个节点ID数组
    nodes:any[]; // 扩散的节点的全部信息
    sep: number; //扩散的度数
  }
  `,
  res: `{}`,

  service: (params: NeighborsQueryParams) => {
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
