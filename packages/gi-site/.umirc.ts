/** 是否为本地研发模式 */
export const isDev = process.env.NODE_ENV === 'development';
console.log('isDev', isDev);
const localDeps = isDev
  ? {}
  : {
      '@alipay/graphinsight': 'GISDK',
    };

export default {
  // 具体配置项
  // mode: "site",
  base: '/',
  publicPath: '/',
  hash: true,
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
    { exact: true, path: '/', component: 'Home' },
    { exact: true, path: '/workspace', component: 'Workspace' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/services/:projectId', component: 'Analysis/DataServices' },
    { exact: true, path: '/assets', component: 'Assets' },
    // { exact: true, path: '/market', component: 'Market/List' },
    // { exact: true, path: '/market/services/:projectId', component: 'Market/CustomServices' },
    // { exact: true, path: '/market/asserts/:id', component: 'Market/Update' },
    // { exact: true, path: '/market/personal', component: 'Market/Personal/PersonalAsserts' },
    { component: '404' },
  ],
  // mfsu: {},
  antd: {
    dark: false,
    compact: false,
  },
  request: {
    dataField: '',
  },
  // chainWebpack(config: any) {
  //   config.plugin('monaco-editor').use(
  //     new MonacoWebpackPlugin({
  //       languages: ['javascript', 'json'],
  //     }),
  //   );
  // },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@antv/graphin': 'Graphin',
    '@antv/graphin-components': 'GraphinComponents',
    '@antv/g6': 'G6',
    antd: 'antd',
    'antd/es/*': 'antd',
    '@ant-design/charts': 'charts',
    '@ant-design/icons': 'icons',
    moment: 'moment',
    ...localDeps,
  },
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',

    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g6/4.6.3/dist/g6.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.2/dist/graphin.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js',

    /** GI */

    'https://gw.alipayobjects.com/os/lib/alipay/graphinsight/1.1.7/dist/index.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',

    // 'https://gw.alipayobjects.com/os/lib/require.js/1.0.0/require.min.js',
  ],
  styles: [
    'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.2/dist/index.css',
    'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/index.css',
    'https://g.alipay.com/@alipay/alex@1.5.2/bundle/alex.global.min.css',
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
