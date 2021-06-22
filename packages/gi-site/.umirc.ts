export default {
  base: '/',
  publicPath: '/public/',
  hash: true,
  history: {
    type: 'hash',
  },
  routes: [
    { exact: true, path: '/', component: 'Home' },
    { exact: true, path: '/workspace', component: 'Workspace' },
    { exact: true, path: '/workspace/:projectId', component: 'Analysis' },
    { exact: true, path: '/market', component: 'Components' },
    { component: '404' }
  ],
  antd: {
    dark: false,
    compact: false,
  },
  request: {
    dataField: '',
  },
  nodeModulesTransform: {
    type: 'none',
  },
};
