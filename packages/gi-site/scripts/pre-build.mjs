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
import path from 'path';
export const G6_VERSION = '4.7.10';
export const GRAPHIN_VERSION = '2.7.13';
export const G2PLOT_VERSION = '2.4.16';
export const ANTD_VERSION = antd.version; //4.24.3
export const GI_VERSION = GI_SDK.version;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export const isDev = process.env.NODE_ENV === 'development';
//@ts-ignore
export const { BUILD_MODE } = process.env;
console.log('BUILD_MODE', BUILD_MODE, 'isDev', isDev);
const isDocker = BUILD_MODE === 'docker';

const depsPackage = [
  {
    url: 'https://gw.alipayobjects.com/os/lib/localforage/1.10.0/dist/localforage.min.js',
    version: '1.10.0',
    global: 'localforage',
    name: 'localforage',
  },
  {
    url: 'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    version: '17.0.2',
    global: 'React',
    name: 'react',
  },
  {
    url: 'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
    name: 'react-dom',
    version: '17.0.2',
    global: 'ReactDOM',
  },
  {
    url: 'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    name: 'lodash',
    version: '4.17.21',
    global: '_',
  },
  {
    url: `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js`,
    name: 'antd',
    version: ANTD_VERSION,
    global: 'antd',
  },
  {
    url: `https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js`,
    name: '@antv/g6',
    version: G6_VERSION,
    global: 'G6',
  },
  {
    url: `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/graphin.min.js`,
    name: '@antv/graphin',
    version: GRAPHIN_VERSION,
    global: 'Graphin',
  },
  {
    url: `https://gw.alipayobjects.com/os/lib/antv/g2plot/${G2PLOT_VERSION}/dist/g2plot.min.js`,
    name: '@antv/g2plot',
    version: G2PLOT_VERSION,
    global: 'G2Plot',
  },
  {
    name: GI_SDK.name,
    version: GI_SDK.version,
    global: 'GISDK',
  },
];

const assetPackage = [
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
    const pkg = name.split('@')[1];
    // console.log('pkg', pkg);
    return `https://gw.alipayobjects.com/os/lib/${pkg}/${version}/dist/index.min.js`;
  }
  return `https://cdn.jsdelivr.net/npm/${name}@${version}/dist/index.min.js`;
};

const getOffline = name => {
  const publicPath = isDocker ? '/public/' : '/';
  return `${publicPath}libs/${name}.min.js`;
};

export const getPackages = (npm, IS_OFFLINE) => {
  return npm.map(c => {
    const { name } = c;
    const assets_url = c.url || getCDN(name, c.version);
    const pkg = name.startsWith('@antv') ? name.split('@antv/')[1] : name;

    return {
      ...c,
      url: IS_OFFLINE ? getOffline(name) : assets_url,
      global: c.global || pkg.split('-').join('_').toUpperCase(),
    };
  });
};

export const ONLINE_PACKAGES = getPackages([...depsPackage, ...assetPackage]);
export const deps_externals = getPackages([...depsPackage, ...assetPackage], BUILD_MODE === 'docker');
export const deps_assets = getPackages([...assetPackage], BUILD_MODE === 'docker');

fs.writeFile(path.resolve(__dirname, './deps.json'), JSON.stringify(ONLINE_PACKAGES, null, 2), () => {});
fs.writeFile(path.resolve(__dirname, './deps_externals.json'), JSON.stringify(deps_externals, null, 2), () => {});
fs.writeFile(path.resolve(__dirname, './deps_assets.json'), JSON.stringify(deps_assets, null, 2), () => {});
fs.writeFile(
  path.resolve(__dirname, '../src/env.ts'),
  `
  /** 脚本生成的环境变量，请勿修改 **/
  export const BUILD_MODE = '${BUILD_MODE}';`,

  () => {},
);
