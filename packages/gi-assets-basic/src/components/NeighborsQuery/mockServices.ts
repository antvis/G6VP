import info from './info';

const { id: ASSET_ID } = info;

const SERVICE_ID = `Mock/${ASSET_ID}`;
const GS_SERVICE_ID = `GraphScope/${ASSET_ID}`;

const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params, localData) => {
        const { id } = params;
        console.log('邻居查询', params);
        const data = {
          nodes: [
            {
              id,
            },
            {
              id: `${id}-1`,
            },
            {
              id: `${id}-2`,
            },
            {
              id: `${id}-3`,
            },
            {
              id: `${id}-4`,
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
        return new Promise(resolve => {
          return resolve(data);
        });
      },
    },
    {
      id: GS_SERVICE_ID,
      service: (params, localData) => {
        const { id, sep } = params;

        return fetch(`http://dev.alipay.net:7001/graphcompute/gremlinQuery`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            statement: `g.V('${id}').repeat(bothE()).times(${sep})`,
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
