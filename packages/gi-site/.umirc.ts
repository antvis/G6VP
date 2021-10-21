import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default {
  base: '/',
  publicPath: '/',
  hash: true,
  history: {
    type: 'hash',
  },

  //mfsu: {}, //https://github.com/umijs/umi/issues/6766

  routes: [
    { exact: true, path: '/', component: 'Home' },
    { exact: true, path: '/workspace', component: 'Workspace' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/market', component: 'Components/List' },
    { exact: true, path: '/market/services/:projectId', component: 'Components/CustomServices' },
    { exact: true, path: '/market/asserts/:id', component: 'Components/Update' },
    { exact: true, path: '/market/personal', component: 'Components/Personal/PersonalAsserts' },
    { component: '404' },
  ],
  antd: {
    dark: false,
    compact: false,
  },
  request: {
    dataField: '',
  },
  chainWebpack(config: any) {
    config.plugin('monaco-editor').use(
      new MonacoWebpackPlugin({
        languages: ['javascript', 'json'],
      }),
    );
  },
  nodeModulesTransform: {
    type: 'none',
  },
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
    // 'lodash-es': {
    //   commonjs: 'lodash',
    //   amd: 'lodash',
    //   root: '_',
    // },
    // lodash: {
    //   commonjs: 'lodash',
    //   amd: 'lodash',
    //   root: '_',
    // },
    //资产中心那块的依赖大包
    '@alipay/alex': 'Alex',
    typescript: 'ts',
    'monaco-editor/esm/vs/editor/editor.api': 'monaco',
  },
  scripts: [
    'https://unpkg.com/react@17.0.2/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g6/4.3.7/dist/g6.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.0/dist/graphin.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',
    /** 资产中心那块的依赖大包 */
    'https://gw.alipayobjects.com/os/lib/require.js/1.0.0/require.min.js',
    'https://gw.alipayobjects.com/os/lib/monaco-editor/0.27.0/min/vs/editor/editor.main.js',
    'https://gw.alipayobjects.com/os/lib/typescript/4.4.3/lib/typescript.js',
    'https://g.alipay.com/@alipay/alex@latest/bundle/alex.global.min.js',
    'https://g.alipay.com/@alipay/alex@latest/languages/languages.global.min.js',
  ],
  styles: [
    // "https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css",
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.0/dist/index.css',
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
