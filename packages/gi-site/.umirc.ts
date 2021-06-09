export default {
  base: '/',
  publicPath: '/public/',
  hash: true,
  history: {
    type: 'hash',
  },
  routes: [
    { exact: true, path: '/', component: 'Home' },
    { exact: true, path: '/workspace', component: 'Analysis' },
    { exact: true, path: '/market', component: 'Components' },
  ],
  antd: {
    dark: true,
    compact: true,
  },
};
