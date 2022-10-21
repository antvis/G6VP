// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

import GI_ASSETS_ADVANCE from '@alipay/gi-assets-advance/package.json';
// import GI_ASSETS_ANALYSIS from '@alipay/gi-assets-analysis/package.json';
import GI_ASSETS_ALGORITHM from '@alipay/gi-assets-algorithm/package.json';
import GI_ASSETS_BASIC from '@alipay/gi-assets-basic/package.json';
import GI_ASSETS_GS_STANDALONE from '@alipay/gi-assets-gs-standalone/package.json';
import GI_ASSETS_SCENE from '@alipay/gi-assets-scene/package.json';
import graphinsight from '@alipay/graphinsight/package.json';
import * as antd from 'antd';
export const G6_VERSION = '4.7.8';
export const GRAPHIN_VERSION = '2.7.9';
export const G2PLOT_VERSION = '2.4.16';
export const ANTD_VERSION = antd.version;
export const GI_VERSION = graphinsight.version;

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
    name: GI_ASSETS_GS_STANDALONE.name,
    version: GI_ASSETS_GS_STANDALONE.version,
  },
];
const NPM_INFO = [
  {
    name: graphinsight.name,
    version: graphinsight.version,
    global: 'GISDK',
  },

  ...assets_npm,
];

export const getPackages = npm => {
  return npm.map(c => {
    const name = c.name.replace('@alipay/', '');

    return {
      url: c.url || `https://gw.alipayobjects.com/os/lib/alipay/${name}/${c.version}/dist/index.min.js`,
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

export default {
  base: '/',
  publicPath: '/',
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
    { exact: true, path: '/', redirect: '/workspace?type=project' },
    {
      exact: true,
      path: '/workspace',
      component: 'Workspace',
    },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/services/', component: 'ServerCenter' },
    { exact: true, path: '/services/:projectId', component: 'Analysis/DataServices' },
    { exact: true, path: '/assets', component: 'Assets' },
    { exact: true, path: '/share/:shareId', component: 'Share' },
    { exact: true, path: '/tabs/:type', component: 'Tab' },

    { component: '404' },
  ],
  request: {
    dataField: '',
  },
  // chainWebpack(config: any) {
  //   // config.plugin('HtmlWebpackPlugin').use(
  //   //   new HtmlWebpackPlugin({
  //   //     filename: 'home.html',
  //   //     template: 'src/pages/Home/index.html',
  //   //   }),
  //   // );
  //   // {
  //   //   filename: 'home.html',
  //   //   template: 'src/pages/Home/index.html',
  //   // }
  //   //   config.plugin('monaco-editor').use(
  //   //     new MonacoWebpackPlugin({
  //   //       languages: ['javascript', 'json'],
  //   //     }),
  //   //   );
  //   // },
  //   // chainWebpack: memo => {
  //   //   // 更多配置 https://github.com/Microsoft/monaco-editor-webpack-plugin#options
  //   //   memo.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
  //   //     // 按需配置
  //   //     { languages: ['javascript', 'json'] },
  //   //   ]);
  //   //   return memo;
  // },
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
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.css`,
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
  theme: {
    black: '#000',
    white: '#fff',
    'primary-color': '#3056E3', // 全局主色
    'link-color': '#3056E3', // 链接色
    'success-color': '#52c41a', // 成功色
    'warning-color': '#faad14', // 警告色
    'error-color': '#f5222d', // 错误色
    'font-size-base': ' 14px', // 主字号
    'heading-color': ' rgba(0, 0, 0, 0.85)', // 标题色
    'text-color': ' rgba(0, 0, 0, 0.65)', // 主文本色
    'text-color-secondary': ' rgba(0, 0, 0, 0.45)', // 次文本色
    'disabled-color': ' rgba(0, 0, 0, 0.25)', // 失效色
    'border-radius-base': ' 2px', // 组件/浮层圆角
    'border-color-base': '#d9d9d9', // 边框色
    'box-shadow-base':
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),0 9px 28px 8px rgba(0, 0, 0, 0.05)', // 浮层阴影
  },
};
