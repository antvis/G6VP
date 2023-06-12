import { GIAssets, utils } from '@antv/gi-sdk';
// import { getCombinedAssets } from '../loader';

import * as GI_ASSETS_ADVANCE from '@antv/gi-assets-advance';
import * as GI_ASSETS_ALGORITHM from '@antv/gi-assets-algorithm';
import * as GI_ASSETS_BASIC from '@antv/gi-assets-basic';
import * as GI_ASSETS_SCENE from '@antv/gi-assets-scene';
/** 引擎包 */
import * as GI_ASSETS_GALAXYBASE from '@antv/gi-assets-galaxybase';
import * as GI_ASSETS_GRAPHSCOPE from '@antv/gi-assets-graphscope';
import * as GI_ASSETS_HUGEGRAPH from '@antv/gi-assets-hugegraph';
import * as GI_ASSETS_JANUSGRAPH from '@antv/gi-assets-janusgraph';
import * as GI_ASSETS_NEO4J from '@antv/gi-assets-neo4j';
import * as GI_ASSETS_TUGRAPH from '@antv/gi-assets-tugraph';
import * as GI_ASSETS_TUGRAPH_ANALYTICS from '@antv/gi-assets-tugraph-analytics';

import OFFICIAL_PACKAGES from '../../scripts/deps_assets.json';
import { IS_DEV_ENV } from './const';

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
  /** 引擎资产: TuGraph*/
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_TUGRAPH'],
    ...GI_ASSETS_TUGRAPH,
  },
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_TUGRAPH_ANALYTICS'],
    ...GI_ASSETS_TUGRAPH_ANALYTICS,
  },
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_GRAPHSCOPE'],
    ...GI_ASSETS_GRAPHSCOPE,
  },
  // 内置 Neo4j
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_NEO4J'],
    ...GI_ASSETS_NEO4J,
  },
  // 内置 HugeGraph
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_HUGEGRAPH'],
    ...GI_ASSETS_HUGEGRAPH,
  },

  // 内置 Galaxybase
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_GALAXYBASE'],
    ...GI_ASSETS_GALAXYBASE,
  },
  {
    ...OFFICIAL_PACKAGES_MAP['GI_ASSETS_JANUSGRAPH'],
    ...GI_ASSETS_JANUSGRAPH,
  },
];

/**
 * 从全量的资产中Pick用户活跃的资产
 * @returns
 */
export const queryAssets = async (activeAssetsKeys?: any): Promise<GIAssets> => {
  let FinalAssets;

  const packages = getAssetPackages();

  if (IS_DEV_ENV) {
    FinalAssets = await loaderCombinedAssets(packages, LOCAL_ASSETS);
  } else {
    FinalAssets = await loaderCombinedAssets(packages);
  }
  if (!activeAssetsKeys) {
    return FinalAssets;
  }

  const components = activeAssetsKeys.components.reduce((acc, curr) => {
    const asset = FinalAssets.components[curr];
    if (asset) {
      return {
        ...acc,
        [curr]: asset,
      };
    }
    return acc;
  }, {});

  // Get all elements from FinalAssets
  const elements = { ...FinalAssets.elements };

  // Get all layouts from FinalAssets
  const layouts = { ...FinalAssets.layouts };

  const templates = { ...FinalAssets.templates };

  const beforeload = [...FinalAssets.beforeload];

  const afterload = [...FinalAssets.afterload];

  return {
    components,
    elements,
    layouts,
    templates,
    services: FinalAssets.services,
    beforeload,
    afterload,
  };
};

/**
 * 查询资产列表
 * @param param 查询参数
 */
export const queryAssetList = async () => {
  let FinalAssets;

  const packages = getAssetPackages();
  if (IS_DEV_ENV) {
    FinalAssets = await loaderCombinedAssets(packages, LOCAL_ASSETS);
  } else {
    FinalAssets = await loaderCombinedAssets(packages);
  }
  const components = Object.keys(FinalAssets.components).map(key => {
    const asset = FinalAssets.components[key];
    const { pkg, version, info } = asset;
    return {
      type: 1, //组件
      id: key,
      pkg,
      version,
      ...info,
    };
  });
  const elements = Object.keys(FinalAssets.elements).map(key => {
    const asset = FinalAssets.elements[key];
    const { pkg, version, info } = asset;
    return {
      type: 2, //元素
      id: key,
      pkg,
      version,
      ...info,
    };
  });
  const layouts = Object.keys(FinalAssets.layouts).map(key => {
    const asset = FinalAssets.layouts[key];
    const { pkg, version, info } = asset;
    return {
      type: 6, //元素
      id: key,
      pkg,
      version,
      ...info,
    };
  });
  return { components, elements, layouts };
};
