/** 是否为本地研发模式 */

export const isDev = process.env.NODE_ENV === 'development';
const assets_npm = [
  {
    name: '@alipay/gi-assets-basic',
    version: '2.0.1',
  },
  // {
  //   name: '@alipay/gi-assets-scene',
  //   version: '2.0.1',
  // },
];
const NPM_INFO = [
  {
    name: '@alipay/graphinsight',
    version: '2.0.1',
    global: 'GISDK',
  },
  ...assets_npm,
];

const getPackages = npm => {
  return npm.map(c => {
    const name = c.name.replace('@alipay/', '');
    return {
      url: `https://gw.alipayobjects.com/os/lib/alipay/${name}/${c.version}/dist/index.min.js`,
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

console.log('isDev', isDev);
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
  // dynamicImportSyntax: {},
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
  // antd: {
  //   dark: false,
  //   compact: false,
  // },
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
    '@antv/g2': 'G2',
    '@antv/g2plot': 'G2Plot',
    // 'react-monaco-editor': 'ReactMonacoEditor',
    ...externals,
  },
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.20.0/dist/antd.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g6/4.6.4/dist/g6.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/graphin.min.js',

    /** GI */
    ...externalScripts,
    'https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',
    /** editor */
    // 'https://gw.alipayobjects.com/os/lib/react-monaco-editor/0.48.0/lib/index.js',
    'https://gw.alipayobjects.com/os/lib/xlsx/0.18.5/dist/xlsx.mini.min.js',
    /** G2 / G2Plot */
    'https://gw.alipayobjects.com/os/lib/antv/g2/4.2.0/dist/g2.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js',
  ],
  styles: [
    ...externalScripts.map(c => {
      return c.replace('min.js', 'css');
    }),
    // 'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/index.css',
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
