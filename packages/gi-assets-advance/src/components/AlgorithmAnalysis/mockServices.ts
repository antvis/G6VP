import info from './info';
const { id: ASSET_ID } = info;
const SERVICE_MOCK_ID = `Mock/${ASSET_ID}`;

const SERVICE_GS_ID = `GraphScope/${ASSET_ID}`;

const mockServices = () => {
  return [
    {
      id: SERVICE_MOCK_ID,
      service: localData => {
        const id = 'mock_algorithm_analysis';
        const data = {
          nodes: [
            {
              id,
              type: 'user',
            },

            {
              id: `${id}-family`,
              type: 'user',
            },
            {
              id: `${id}-card`,
              type: 'card',
            },
          ],
          edges: [
            {
              source: id,
              target: `${id}-family`,
              type: 'family',
            },
            {
              source: id,
              target: `${id}-card`,
              type: 'own',
            },
          ],
        };
        return new Promise(resolve => {
          return resolve({
            success: true,
            data,
          });
        });
      },
    },
    {
      id: SERVICE_GS_ID,
      service: (params = {}) => {
        return fetch(`http://dev.alipay.net:7001/graphcompute/execAlgorithm`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            ...params,
            projectId: localStorage.getItem('GI_PROJECT_ID') || '4600001',
            // graphName: localStorage.getItem('graphScopeGraphName'),
          }),
        }).then(response => response.json());
      },
    },
  ];
};

export default mockServices;
