import info from './info';

const { id: ASSET_ID } = info;

const SERVICE_ID = `MOCK/${ASSET_ID}`;
const ONLINE_SERVICE_ID = `ONLINE/${ASSET_ID}`;

const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params, localData) => {
        const uuid = `${Math.random()
          .toString(36)
          .substr(2)}`;
        const href = window.location.origin + '/#/share/' + uuid;
        //  window.localforage 是 GraphInsight 平台提供的全局变量，详情参考：https://github.com/localForage/localForage
        //@ts-ignore
        const { localforage } = window;
        localforage.setItem(uuid, {
          id: uuid,
          type: 'save',
          params: JSON.stringify(params),
        });
        return new Promise(resolve => {
          return resolve({
            success: true,
            data: {
              shareId: uuid,
            },
            // data: href,
          });
        });
      },
    },
    {
      id: ONLINE_SERVICE_ID,
      service: (params, localData) => {
        debugger;
        return fetch(`http://dev.alipay.net:7001/share/create`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(params),
        })
          .then(response => response.json())
          .then(res => {
            return res.data;
          });
      },
    },
  ];
};

export default mockServices;
