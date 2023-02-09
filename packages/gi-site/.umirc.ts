// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
import GI_SDK from '@antv/gi-sdk/package.json';
/** build-in assets */
import GI_ASSETS_ADVANCE from '@antv/gi-assets-advance/package.json';
import GI_ASSETS_ALGORITHM from '@antv/gi-assets-algorithm/package.json';
import GI_ASSETS_BASIC from '@antv/gi-assets-basic/package.json';
import GI_ASSETS_SCENE from '@antv/gi-assets-scene/package.json';

/** build-in engine */
import GI_ASSETS_GTAPHSCOPE from '@antv/gi-assets-graphscope/package.json';
import GI_ASSETS_NEO4J from '@antv/gi-assets-neo4j/package.json';
import GI_ASSETS_TUGRAPH from '@antv/gi-assets-tugraph/package.json';

import * as antd from 'antd';
export const G6_VERSION = '4.7.10';
export const GRAPHIN_VERSION = '2.7.13';
export const G2PLOT_VERSION = '2.4.16';
export const ANTD_VERSION = antd.version;
export const GI_VERSION = GI_SDK.version;

/** 是否为本地研发模式 */
//@ts-ignore
export const isDev = process.env.NODE_ENV === 'development';
const assets_npm = [
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
const NPM_INFO = [
  {
    name: GI_SDK.name,
    version: GI_SDK.version,
    global: 'GISDK',
  },

  ...assets_npm,
];

const getCDN = (name: string, version: string, type?: any) => {
  if (type === 'antgroup') {
    return `https://gw.alipayobjects.com/os/lib/antv/${name}/${version}/dist/index.min.js`;
  }
  return `https://cdn.jsdelivr.net/npm/@antv/${name}/${version}/dist/index.min.js`;
};
export const getPackages = npm => {
  return npm.map(c => {
    const name = c.name.replace('@antv/', '');
    return {
      url: c.url || getCDN(name, c.version, 'antgroup'), //`https://gw.alipayobjects.com/os/lib/alipay/${name}/${c.version}/dist/index.min.js`,
      global: name.split('-').join('_').toUpperCase(),
      ...c,
    };
  });
};

export const PACKAGES = getPackages(NPM_INFO);
export const OFFICIAL_PACKAGES = getPackages(assets_npm);

const externals = isDev
  ? {}
  : PACKAGES.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: `${curr.global}`,
      };
    }, {});

const externalScripts = isDev
  ? []
  : PACKAGES.map(c => {
      return c.url;
    });

//@ts-ignore
const { BUILD_MODE } = process.env;
console.log('BUILD_MODE', BUILD_MODE);
export default {
  base: '/',
  publicPath: BUILD_MODE ? '/public/' : '/',
  hash: true,
  favicon: 'https://gw.alipayobjects.com/zos/bmw-prod/b9a0f537-3768-445d-aa39-ff49de82124a.svg',
  history: {
    type: 'hash',
  },
  alias: {
    '@': './src',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { exact: true, path: '/', redirect: '/workspace' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/share/:shareId', component: 'Share' },
    { exact: true, path: '/tabs/:type', component: 'Tab' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/workspace', component: 'Workspace' },
        { exact: true, path: '/services', component: 'ServerCenter' },
        { exact: true, path: '/services/:projectId', component: 'Analysis/DataServices' },
        { exact: true, path: '/assets', component: 'Assets' },

        { component: '404' },
      ],
    },
  ],
  request: {
    dataField: '',
  },

  externals: {
    lodash: '_',
    react: 'React',
    'react-dom': 'ReactDOM',
    '@antv/graphin': 'Graphin',
    '@antv/g6': 'G6',
    antd: 'antd',
    '@ant-design/charts': 'charts',
    '@ant-design/icons': 'icons',
    moment: 'moment',
    xlsx: 'XLSX',
    '@antv/g2plot': 'G2Plot',
    localforage: 'localforage',
    ...externals,
  },
  scripts: [
    'https://gw.alipayobjects.com/os/lib/localforage/1.10.0/dist/localforage.min.js',
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js`,

    /** Graphin */
    `https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js`,
    `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/graphin.min.js`,

    /**  G2Plot */
    `https://gw.alipayobjects.com/os/lib/antv/g2plot/${G2PLOT_VERSION}/dist/g2plot.min.js`,
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',

    /** GI */
    ...externalScripts,

    /** editor */
    'https://gw.alipayobjects.com/os/lib/xlsx/0.18.5/dist/xlsx.mini.min.js',
  ],
  styles: [
    ...externalScripts.map(c => {
      return c.replace('min.js', 'css');
    }),
    `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/index.css`,
  ],
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
};
