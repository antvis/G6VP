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
  ],
  antd: {
    dark: true,
    compact: true,
  },
};
