import { utils } from '@antv/gi-sdk';
const getCombinedServiceConfig = (mockServiceConfig, savedServiceConfig) => {
  /** 将组件的MockServices与项目自身带的 services 去重处理 */
  const runtimeServiceConfig = utils.uniqueElementsBy([...savedServiceConfig, ...mockServiceConfig], (a, b) => {
    return a.id === b.id;
  });
  return runtimeServiceConfig;
};

export default getCombinedServiceConfig;
