export default {
  base: '/',
  publicPath: '/',
  hash: true,
  favicon: 'https://gw.alipayobjects.com/zos/bmw-prod/b9a0f537-3768-445d-aa39-ff49de82124a.svg',
  history: {
    type: 'hash',
  },

  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { exact: true, path: '/', component: 'index' },
        { exact: true, path: '/video', component: 'Video' },
        // { exact: true, path: '/case', component: './Case' },
      ],
    },
  ],

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
  ],
  styles: [],
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
