const ASSET_ID = 'PropertiesPanel';
const SERVICE_ID = `Mock/${ASSET_ID}`;
const GraphScope_SERVICE_ID = `GraphScope/${ASSET_ID}`;

export interface Parmas {
  [key: string]: any;
}
export interface LocalData {
  nodes: any[];
  edges: any[];
}

const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params: Parmas, localData: LocalData) => {
        const { data } = params;
        return new Promise(resolve => {
          return resolve(data);
        });
      },
    },
    {
      id: GraphScope_SERVICE_ID,
      service: (params: Parmas) => {
        const { id, ...others } = params;
        return fetch(`http://dev.alipay.net:7001/graphcompute/properties`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            ...others,
            id: [id],
          }),
        })
          .then(response => response.json())
          .then(res => {
            const { success, data } = res;
            if (success) {
              return data[id];
            }
            return res;
          });
      },
    },
  ];
};

export default mockServices;
