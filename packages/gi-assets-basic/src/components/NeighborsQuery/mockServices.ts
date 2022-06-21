import info from './info';

const { id: ASSET_ID } = info;

const SERVICE_ID = `Mock/${ASSET_ID}`;
const GS_SERVICE_ID = `GraphScope/${ASSET_ID}`;

const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params, localData) => {
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
                nodes: [].concat(acc.nodes, curr.nodes),
                edges: [].concat(acc.edges, curr.edges),
              };
            },
            { nodes: [], edges: [] },
          );
        return new Promise(resolve => {
          return resolve(transfrom(datas));
        });
      },
    },
    {
      id: GS_SERVICE_ID,
      service: (params, localData) => {
        const { id, sep } = params;

        // 根据 sep 拼接 .bothE() 个数
        let str = '';
        for (let i = 0; i < sep - 1; i++) {
          str += '.both()';
        }

        return fetch(`http://dev.alipay.net:7001/graphcompute/gremlinQuery`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            // statement: `g.V('${id}').repeat(bothE()).times(${sep})`,
            statement: `g.V(${id})${str}.bothE()`,
            gremlinServer: localStorage.getItem('graphScopeGremlinServer'),
          }),
        })
          .then(response => response.json())
          .then(res => {
            if (res.success) {
              return res.data;
            }
            return {
              nodes: [],
              edges: [],
            };
          });
      },
    },
  ];
};

export default mockServices;
