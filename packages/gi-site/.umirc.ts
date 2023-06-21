import { defineConfig } from 'umi';
import GI_SDK from '@antv/gi-sdk/package.json';
import GI_THEME_ANTD from '@antv/gi-theme-antd/package.json';
import deps_externals from './scripts/deps_externals.json';
export const G6_VERSION = '4.8.14';
export const GRAPHIN_VERSION = '2.7.16';
export const G2PLOT_VERSION = '2.4.16';
export const ANTD_VERSION = '4.24.8';
export const GI_VERSION = GI_SDK.version;
export const GI_THEME_ANTD_VERSION = GI_THEME_ANTD.version;

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
const BASE_CONFIG = {
  links: [
    {
      href: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
      rel: 'shortcut icon',
    },
  ],
};
const EXTRA_CONFIG = isDev
  ? {
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd',
      },
      scripts: ['https://gw.alipayobjects.com/os/lib/antd/4.24.8/dist/antd.min.js'],
      links: [],
    }
  : {
      externals: {
        ...externals,
      },
      scripts: [...externalScripts],
      links: [
        ...externalScripts.map(c => {
          return { href: c.src.replace('min.js', 'css'), rel: 'stylesheet' };
        }),
      ],
    };

export default {
  base: '/',
  title: 'AntV Insight 让数据栩栩如生',
  metas: [
    {
      name: 'keywords',
      content: 'AntV Insight 数据可视化平台 图可视化 地理可视化 分析应用低代码构建',
    },
    {
      name: 'description',
      content:
        'AntV Insight 是蚂蚁集团 AntV 团队推出的一款数据分析产品，用户可以在线完成视觉映射，分析洞察工作，也可以一键导出SDK，二次开发，集成部署',
    },
  ],
  externals: EXTRA_CONFIG.externals,
  scripts: EXTRA_CONFIG.scripts,
  links: [...BASE_CONFIG.links, ...EXTRA_CONFIG.links],
  styles: ['body {background: var(--background-color); color: var(--text-color)}'],
  headScripts: [
    'https://www.googletagmanager.com/gtag/js?id=G-9Z6Z0NTLFB',
    "window.dataLayer = window.dataLayer || [];function gtag() {dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-9Z6Z0NTLFB');",
    "window.TracertCmdCache = window.TracertCmdCache || [];var t = window.Tracert || {_isRenderInit: !0,call: function () {window.TracertCmdCache.push(arguments);},},f = ['call','start','config','logPv','info','err','click','expo','pageName','pageState','time','timeEnd','parse','checkExpo','stringify','report','set','before'];for (let i = 0; i < f.length; i++) {(function (fn) {t[fn] = function () {var a = [],l = arguments.length;for (var j = 0; j < l; j++) {a.push(arguments[j]);}a.unshift(fn);window.TracertCmdCache.push(a);};})(f[i]);}window.Tracert = t;window._to = window._to || {};function filterLog(logType) {return function (opts) {return !!window.GI_USER_INFO?.outUserNo;};}window.Tracert.call('before', 'logPv', filterLog('PageMonitor'));window.Tracert.call('before', 'expo', filterLog('expo'));window.Tracert.call('before', 'click', filterLog('click'));",
    'https://ur.alipay.com/tracert_a3220.js',
    'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
  ],
  publicPath: BUILD_MODE === 'docker' ? '/public/' : '/',
  hash: true,
  favicons: ['https://gw.alipayobjects.com/zos/bmw-prod/b9a0f537-3768-445d-aa39-ff49de82124a.svg'],
  history: {
    type: 'browser',
  },
  alias: {
    '@': './src',
  },
  routes: [
    { exact: true, path: '', redirect: '/home' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/share/:shareId', component: 'Share' },
    { exact: true, path: '/tabs/:type', component: 'Tab' },
    {
      path: '/',
      component: '@/layouts/Main',
      routes: [
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
              path: 'create',
              component: 'Workbook/Create',
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
          ],
        },
        {
          path: '/open',
          component: '@/layouts/SideNav',
          routes: [
            {
              exact: true,
              path: 'assets-manage',
              component: 'Assets',
            },
            {
              exact: true,
              path: 'assets-list',
              component: 'AssetsList',
            },
            {
              exact: true,
              path: 'engines',
              component: 'ServerCenter',
            },
            {
              exact: true,
              path: 'g6v5demo',
              component: 'G6V5Demo',
            },
            {
              exact: true,
              path: 'user',
              component: 'Share',
            },
          ],
        },
        { exact: true, path: '/services', component: 'ServerCenter' },
        { exact: true, path: '/workspace', component: 'Workspace' },
      ],
    },
    { component: '404' },
  ],

  request: {
    dataField: '',
  },
  mfsu: false,
  // monorepoRedirect: {
  //   srcDir: ['.', 'src'],
  //   exclude: [/^(?!@alipay|@antv).*/],
  // },
  // analyze: {
  // analyzerMode: 'server',
  // analyzerPort: 8888,
  // openAnalyzer: true,
  // // generate stats file while ANALYZE_DUMP exist
  // generateStatsFile: false,
  // statsFilename: 'stats.json',
  // logLevel: 'info',
  // defaultSizes: 'parsed', // stat  // gzip
  // },
  chainWebpack(memo, { type }) {
    memo.module
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
  },
};
