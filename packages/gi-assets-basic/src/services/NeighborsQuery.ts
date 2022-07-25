import { GraphinData } from '@antv/graphin';

export interface ServiceObject {
  name: string;
  service: (params: any) => Promise<GraphinData | boolean | {}>;
}

export interface NeighborsQueryParams {
  ids: string[];
  data: any;
}

export const NeighborsQuery: ServiceObject = {
  name: '邻居查询',
  service: (params: NeighborsQueryParams) => {
    const { ids, data: DATA = {} } = params;
    const { type = 'user' } = DATA;
    console.log('邻居查询', params, ids, type);
    const transfrom = p => {
      const { nodes, edges } = p;
      return {
        nodes: nodes.map(c => {
          return {
            id: c.id,
            data: c,
            nodeType: c.type,
            nodeTypeKeyFromProperties: 'type',
          };
        }),
        edges: edges.map(c => {
          return {
            source: c.source,
            target: c.target,
            id: `${c.source}-${c.target}`,
            data: c,
            edgeType: c.type,
            edgeTypeKeyFromProperties: 'type',
          };
        }),
      };
    };
    const datas = ids
      .map(id => {
        return {
          nodes: [
            {
              id,
              type,
            },
            {
              id: `${id}-1`,
              type,
            },
            {
              id: `${id}-2`,
              type,
            },
            {
              id: `${id}-3`,
              type,
            },
            {
              id: `${id}-4`,
              type,
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
      })
      .reduce(
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
