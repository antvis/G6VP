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
export const ANTD_VERSION = antd.version; //4.24.3
export const GI_VERSION = GI_SDK.version;

// import { externals, externalScripts } from './scripts/pre-build.mjs';

/** 是否为本地研发模式 */
//@ts-ignore
export const isDev = process.env.NODE_ENV === 'development';
//@ts-ignore
export const { BUILD_MODE } = process.env;

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

const getCDN = (name: string, version: string, type = 'antgroup') => {
  if (type === 'antgroup') {
    return `https://gw.alipayobjects.com/os/lib/antv/${name}/${version}/dist/index.min.js`;
  }
  return `https://cdn.jsdelivr.net/npm/@antv/${name}/${version}/dist/index.min.js`;
};

const getOffline = (name: string, version: string, type?: any) => {
  return `/public/@antv/${name}.min.js`;
};

export const getPackages = (npm, IS_OFFLINE) => {
  return npm.map(c => {
    const name = c.name.replace('@antv/', '');
    const assets_url = IS_OFFLINE ? getOffline(name, c.version) : getCDN(name, c.version, 'antgroup');
    return {
      url: c.url || assets_url,
      global: c.global || name.split('-').join('_').toUpperCase(),
      ...c,
    };
  });
};

const [_sdk, ...otherAssets] = assets_npm;
export const PACKAGES = getPackages(assets_npm, isDev);
export const OFFICIAL_PACKAGES = getPackages(otherAssets, isDev);

// export const OFFLINE_PACKAGES = getPackages(assets_npm, true);
// export const ONLINE_PACKAGES = getPackages(assets_npm, false);

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
      return { src: c.url };
    });

const EXTRA_CONFIG = BUILD_MODE
  ? {
      externals: {
        lodash: '_',
        react: 'React',
        'react-dom': 'ReactDOM',
        '@antv/graphin': 'Graphin',
        '@antv/g6': 'G6',
        antd: 'antd',
        '@antv/g2plot': 'G2Plot',
        localforage: 'localforage',
        // '@antv/gi-sdk': 'GISDK',
        ...externals,
      },

      scripts: [
        { src: `/public/libs/localforage.min.js` },
        { src: `/public/libs/react.production.min.js` },
        { src: `/public/libs/react-dom.production.min.js` },
        { src: `/public/libs/lodash.min.js` },
        { src: `/public/libs/moment.js` },
        /** antd */
        { src: `/public/libs/antd.min.js` },
        /** Graphin */
        { src: `/public/libs/g6.min.js` },
        { src: `/public/libs/graphin.min.js` },
        /**  G2Plot */
        { src: `/public/libs/g2plot.min.js` },
        /**  GISDK */
        // { src: `/public/libs/gi-sdk.min.js` },
        ...externalScripts,
      ],
      links: [
        {
          href: `/public/libs/antv/graphin.css`,
          rel: 'stylesheet',
        },
        ...externalScripts.map(c => {
          return { href: c.src.replace('min.js', 'css'), rel: 'stylesheet' };
        }),
      ],
    }
  : {
      externals: {
        lodash: '_',
        react: 'React',
        'react-dom': 'ReactDOM',
        '@antv/graphin': 'Graphin',
        '@antv/g6': 'G6',
        antd: 'antd',
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
          return c.src.replace('min.js', 'css');
        }),
        `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/index.css`,
      ],
    };
export default {
  base: '/',
  publicPath: BUILD_MODE ? '/public/' : '/',
  // publicPath: '/public/',
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
    { exact: true, path: '/', redirect: '/home' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/share/:shareId', component: 'Share' },
    { exact: true, path: '/tabs/:type', component: 'Tab' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/workspace', component: 'Workspace' },
        { exact: true, path: '/services', component: 'ServerCenter' },
        { exact: true, path: '/home', component: 'Home' },
        {
          path: '/dataset',
          component: '@/layouts/SideNav',
          routes: [
            {
              exact: true,
              path: 'list',
              component: 'Dataset/List',
            },
            {
              exact: true,
              path: 'list/:id',
              component: 'Dataset/Detail',
            },
            {
              exact: true,
              path: 'create',
              component: 'Dataset/Create',
            },
            {
              exact: true,
              path: 'case',
              component: 'Dataset/Case',
            },
            {
              exact: true,
              path: 'SYSTEM_DIRECT_CONNECT',
              component: 'Dataset/SystemDirectConnect',
            },
            {
              exact: true,
              path: 'delete',
              component: 'Dataset/Delete',
            },
          ],
        },
        {
          path: '/workbook',
          component: '@/layouts/SideNav',
          routes: [
            {
              exact: true,
              path: 'project',
              component: 'Workspace/Projects',
            },
            {
              exact: true,
              path: 'template',
              component: 'Template/index',
            },
            {
              exact: true,
              path: 'template/:id',
              component: 'Template/Detail',
            },
            {
              exact: true,
              path: 'report',
              component: 'Share',
            },
            {
              exact: true,
              path: 'case',
              component: 'Workspace/Case',
            },
          ],
        },
        {
          path: '/open',
          component: '@/layouts/SideNav',
          routes: [
            {
              exact: true,
              path: 'assets',
              component: 'Assets',
            },
            {
              exact: true,
              path: 'engines',
              component: 'ServerCenter',
            },
            {
              exact: true,
              path: 'user',
              component: 'Share',
            },
          ],
        },
        { component: '404' },
      ],
    },
  ],
  request: {
    dataField: '',
  },
  ...EXTRA_CONFIG,
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
