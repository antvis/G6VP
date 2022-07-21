import { utils } from '@alipay/graphinsight';

const { generatorSchemaByGraphData, generatorStyleConfigBySchema } = utils;
export { generatorSchemaByGraphData, generatorStyleConfigBySchema };

export const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};

export const getAssetServices = (services?: any) => {
  //@ts-ignore
  if (!services) {
    return [];
  }
  return services.reduce((acc, curr) => {
    const { id, name, pkg, version, ...otherServices } = curr;
    const sers = Object.keys(otherServices).map(k => {
      const ser = otherServices[k];
      return {
        id: `${id}/${k}`,
        name: ser.name,
        service: ser.service,
      };
    });
    return [...acc, ...sers];
  }, []);
};
