import GI_SDK from '@antv/gi-sdk/package.json' assert { type: 'json' };
/** build-in assets */
import GI_ASSETS_ADVANCE from '@antv/gi-assets-advance/package.json' assert { type: 'json' };
import GI_ASSETS_ALGORITHM from '@antv/gi-assets-algorithm/package.json' assert { type: 'json' };
import GI_ASSETS_BASIC from '@antv/gi-assets-basic/package.json' assert { type: 'json' };
import GI_ASSETS_SCENE from '@antv/gi-assets-scene/package.json' assert { type: 'json' };
import fs from 'fs';
/** build-in engine */
import GI_ASSETS_GTAPHSCOPE from '@antv/gi-assets-graphscope/package.json' assert { type: 'json' };
import GI_ASSETS_NEO4J from '@antv/gi-assets-neo4j/package.json' assert { type: 'json' };
import GI_ASSETS_TUGRAPH from '@antv/gi-assets-tugraph/package.json' assert { type: 'json' };

import * as antd from 'antd';
export const G6_VERSION = '4.7.10';
export const GRAPHIN_VERSION = '2.7.13';
export const G2PLOT_VERSION = '2.4.16';
export const ANTD_VERSION = antd.version; //4.24.3
export const GI_VERSION = GI_SDK.version;

const assets_npm = [
  {
    name: GI_SDK.name,
    version: GI_SDK.version,
    global: 'GISDK',
  },
  {
    name: GI_ASSETS_BASIC.name,
    version: GI_ASSETS_BASIC.version,
  },
  {
    name: GI_ASSETS_ADVANCE.name,
    version: GI_ASSETS_ADVANCE.version,
  },
  {
    name: GI_ASSETS_SCENE.name,
    version: GI_ASSETS_SCENE.version,
  },
  {
    name: GI_ASSETS_ALGORITHM.name,
    version: GI_ASSETS_ALGORITHM.version,
  },
  {
    name: GI_ASSETS_GTAPHSCOPE.name,
    version: GI_ASSETS_GTAPHSCOPE.version,
  },
  {
    name: GI_ASSETS_NEO4J.name,
    version: GI_ASSETS_NEO4J.version,
  },
  {
    name: GI_ASSETS_TUGRAPH.name,
    version: GI_ASSETS_TUGRAPH.version,
  },
];

const getCDN = (name, version, type = 'antgroup') => {
  if (type === 'antgroup') {
    return `https://gw.alipayobjects.com/os/lib/antv/${name}/${version}/dist/index.min.js`;
  }
  return `https://cdn.jsdelivr.net/npm/@antv/${name}@${version}/dist/index.min.js`;
};

export const getPackages = npm => {
  return npm.map(c => {
    const name = c.name.replace('@antv/', '');
    const assets_url = getCDN(name, c.version, '');
    return {
      url: c.url || assets_url,
      global: c.global || name.split('-').join('_').toUpperCase(),
      ...c,
    };
  });
};

export const PACKAGES = getPackages(assets_npm);

fs.writeFile('./scripts/assets_package.json', JSON.stringify(PACKAGES, null, 2), () => {});

export const externals = PACKAGES.reduce((acc, curr) => {
  return {
    ...acc,
    [curr.name]: `${curr.global}`,
  };
}, {});

export const externalScripts = PACKAGES.map(c => {
  return { src: c.url };
});
