import GI_SDK from '@antv/gi-sdk/package.json';

import * as antd from 'antd';
import deps_externals from './scripts/deps_externals.json';
export const G6_VERSION = '4.7.10';
export const GRAPHIN_VERSION = '2.7.13';
export const G2PLOT_VERSION = '2.4.16';
export const ANTD_VERSION = antd.version; //4.24.3
export const GI_VERSION = GI_SDK.version;

/** 是否为本地研发模式 */
//@ts-ignore
export const isDev = process.env.NODE_ENV === 'development';
//@ts-ignore
export const { BUILD_MODE } = process.env;

export const externals = deps_externals.reduce((acc, curr) => {
  return {
    ...acc,
    [curr.name]: `${curr.global}`,
  };
}, {});

export const externalScripts = deps_externals.map(c => {
  return { src: c.url };
});
console.log('externals', externals, BUILD_MODE);

export default {
  // base: '/',
  base: '/',
  publicPath: BUILD_MODE === 'docker' ? '/public/' : '/',
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
  externals: {
    ...externals,
  },
  scripts: [...externalScripts],
  links: [
    ...externalScripts.map(c => {
      return { href: c.src.replace('min.js', 'css'), rel: 'stylesheet' };
    }),
  ],
  request: {
    dataField: '',
  },
  // ...EXTRA_CONFIG,
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
