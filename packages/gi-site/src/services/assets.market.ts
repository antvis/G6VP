import { GIAssets, utils } from '@antv/gi-sdk';
// import { getCombinedAssets } from '../loader';
import * as GI_ASSETS_ADVANCE from '@antv/gi-assets-advance';
import * as GI_ASSETS_ALGORITHM from '@antv/gi-assets-algorithm';
import * as GI_ASSETS_BASIC from '@antv/gi-assets-basic';
import * as GI_ASSETS_GRAPHSCOPE from '@antv/gi-assets-graphscope';
import * as GI_ASSETS_NEO4J from '@antv/gi-assets-neo4j';
import * as GI_ASSETS_SCENE from '@antv/gi-assets-scene';
import { OFFICIAL_PACKAGES } from '../../.umirc';
import { IS_LOCAL_ENV } from './const';

const { loaderCombinedAssets, getAssetPackages } = utils;
const OFFICIAL_PACKAGES_MAP = OFFICIAL_PACKAGES.reduce((acc, curr) => {
  return {
    ...acc,
    [curr.global]: curr,
  };
}, {});

const LOCAL_ASSETS: any[] = [
  /** 内置的资产 */
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_BASIC'],
    ...GI_ASSETS_BASIC,
  },
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_ADVANCE'],
    ...GI_ASSETS_ADVANCE,
  },
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_ALGORITHM'],
    ...GI_ASSETS_ALGORITHM,
  },
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_SCENE'],
    ...GI_ASSETS_SCENE,
  },
  // 内置 Neo4j
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_NEO4J'],
    ...GI_ASSETS_NEO4J,
  },
  // 内置 GraphScope 单机版
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_GRAPHSCOPE'],
    ...GI_ASSETS_GRAPHSCOPE,
  },
];

/**
 * 从全量的资产中Pick用户活跃的资产
 * @returns
 */
export const queryAssets = async (activeAssetsKeys: any): Promise<GIAssets> => {
  let components = {};
  let elements;
  let layouts;
  let FinalAssets;

  const packages = getAssetPackages();
  if (IS_LOCAL_ENV) {
    FinalAssets = await loaderCombinedAssets(packages, LOCAL_ASSETS);
  } else {
    FinalAssets = await loaderCombinedAssets(packages);
  }

  console.log('FinalAssets', FinalAssets, LOCAL_ASSETS);

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
