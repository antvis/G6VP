import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default {
  base: '/',
  publicPath: '/',
  hash: true,
  history: {
    type: 'hash',
  },

  // mfsu: {},//https://github.com/umijs/umi/issues/6766

  routes: [
    { exact: true, path: '/', component: 'Home' },
    { exact: true, path: '/workspace', component: 'Workspace' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/market', component: 'Components/List' },
    { exact: true, path: '/market/:id', component: 'Components/Update' },
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
};
