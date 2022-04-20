/** 是否为本地研发模式 */
export const isDev = process.env.NODE_ENV === 'development';

const localDeps = isDev
  ? {}
  : {
      '@alipay/graphinsight': 'GISDK',
    };

const localScripts = isDev ? [] : ['https://gw.alipayobjects.com/os/lib/alipay/graphinsight/1.2.1/dist/index.min.js'];

export default {
  nodeModulesTransform: {
    type: 'none',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    '@antv/graphin': 'Graphin',
    '@antv/g6': 'G6',
    antd: 'antd',
    '@ant-design/charts': 'charts',
    '@ant-design/icons': 'icons',
    moment: 'moment',
    ...localDeps,
  },
  scripts: [
    'https://unpkg.com/react@17.0.2/umd/react.production.min.js',
    'https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js',
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/g6/4.6.4/dist/g6.min.js',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/graphin.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',
    ...localScripts,
  ],
  styles: [
    'https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css',
    'https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/index.css',
  ],
};
