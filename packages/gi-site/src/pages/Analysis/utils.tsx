import { utils } from '@alipay/graphinsight';

const { generatorSchemaByGraphData, generatorStyleConfigBySchema } = utils;
export { generatorSchemaByGraphData, generatorStyleConfigBySchema };

export const isObjectEmpty = obj => {
  return Object.keys(obj).length === 0;
};
