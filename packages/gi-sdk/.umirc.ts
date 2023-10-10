export default {
  resolve: { includes: ['docs'] },
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    '@antv/g6': 'window.G6V5',
    antd: 'window.antd',
  },
  links: [{ href: 'https://gw.alipayobjects.com/os/lib/antd/4.24.14/dist/antd.css', rel: 'stylesheet' }],
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.development.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.development.js',
    'https://gw.alipayobjects.com/os/lib/antv/g6/5.0.0-beta.20/dist/g6.min.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.24.14/dist/antd.min.js',
  ],
};
