import { GIAssets } from '@antv/gi-sdk';
import { getCombinedAssets } from '../loader';

/**
 * 从全量的资产中Pick用户活跃的资产
 * @returns
 */
export const queryAssets = async (activeAssetsKeys: any): Promise<GIAssets> => {
  let components = {};
  let elements;
  let layouts;
  // http://localhost:8000/#/workspace/8100001?nav=data
  const FinalAssets = await getCombinedAssets();

  components = activeAssetsKeys.components.reduce((acc, curr) => {
    const asset = FinalAssets.components[curr];
    if (asset) {
      return {
        ...acc,
        [curr]: asset,
      };
    }
    return acc;
  }, {});

  elements = activeAssetsKeys.elements.reduce((acc, curr) => {
    const asset = FinalAssets.elements[curr];
    if (asset) {
      return {
        ...acc,
        [curr]: asset,
      };
    }
    return acc;
  }, {});

  layouts = activeAssetsKeys.layouts.reduce((acc, curr) => {
    const asset = FinalAssets.layouts[curr];
    if (asset) {
      return {
        ...acc,
        [curr]: asset,
      };
    }
    return acc;
  }, {});

  return await new Promise(resolve => {
    resolve({
      components,
      elements,
      layouts,
      services: FinalAssets.services,
    } as GIAssets);
  });
};
