import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default {
  base: '/',
  publicPath: '/',
  hash: true,
  history: {
    type: 'hash',
  },
  alias: {
    '@': './src',
  },
  favicon: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*CoNCRL6oJXoAAAAAAAAAAAAAARQnAQ',
  //mfsu: {}, //https://github.com/umijs/umi/issues/6766

  routes: [
    { exact: true, path: '/', component: 'Home' },
    { exact: true, path: '/workspace', component: 'Workspace' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/market', component: 'Market/List' },
    { exact: true, path: '/market/services/:projectId', component: 'Market/CustomServices' },
    { exact: true, path: '/market/asserts/:id', component: 'Market/Update' },
    { exact: true, path: '/market/personal', component: 'Market/Personal/PersonalAsserts' },
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
    /** 组件中的一些依赖，未来要动态加载 */
    '@antv/s2': 'S2',
    '@antv/s2-react': 'S2-React',
    '@antv/g2plot': 'G2Plot',
    '@antv/g2': 'G2',
    //资产中心那块的依赖大包
    '@alipay/alex': 'Alex',
    typescript: 'ts',
    'monaco-editor/esm/vs/editor/editor.api': 'monaco',
    systemjs: 'System',
  },
  scripts: [
    'https://gw.alipayobjects.com/os/lib/systemjs/6.11.0/dist/system.min.js',
    'https://unpkg.com/react@17.0.2/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g6/4.5.0/dist/g6.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.9/dist/graphin.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',
    /** 组件的依赖 */
    'https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.2/dist/g2plot.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g2/4.1.35/dist/g2.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/s2/1.4.0-alpha.2/dist/index.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/s2-react/1.4.0-alpha.2/dist/index.min.js',

    /** 资产中心那块的依赖大包 */
    'https://gw.alipayobjects.com/os/lib/require.js/1.0.0/require.min.js',
    'https://gw.alipayobjects.com/os/lib/monaco-editor/0.27.0/min/vs/editor/editor.main.js',
    'https://gw.alipayobjects.com/os/lib/typescript/4.4.3/lib/typescript.js',
    'https://g.alipay.com/@alipay/alex@latest/bundle/alex.global.min.js',
    'https://g.alipay.com/@alipay/alex@latest/languages/languages.global.min.js',
  ],
  styles: [
    // "https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css",
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.9/dist/index.css',
    'https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/index.css',
    'https://g.alipay.com/@alipay/alex@1.5.2/bundle/alex.global.min.css',
    'https://gw.alipayobjects.com/os/lib/antv/s2-react/1.4.0-alpha.2/dist/style.min.css',
    'https://gw.alipayobjects.com/os/lib/antv/s2/1.4.0-alpha.2/dist/style.min.css',
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
