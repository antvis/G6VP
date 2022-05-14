import info from './info';

const { id: ASSET_ID } = info;

const SERVICE_ID = `MOCK/${ASSET_ID}`;

const mockServices = () => {
  return [
    {
      id: SERVICE_ID,
      service: (params, localData) => {
        const { id } = params;
        const uuid = `${Math.random().toString(36).substr(2)}`;
        window.localStorage.setItem(uuid, JSON.stringify(params));
        const href = window.location.origin + '/#/share/' + uuid;
        console.log('参数', params, href);
        return new Promise(resolve => {
          return resolve({
            success: true,
            data: href,
          });
        });
      },
    },
  ];
};

export default mockServices;
