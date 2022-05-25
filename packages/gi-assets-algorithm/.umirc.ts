export default {
  // 具体配置项
  // mode: "site",

  nodeModulesTransform: {
    type: "none",
  },
  mfsu: {},
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "@antv/graphin": "Graphin",
    "@antv/graphin-components": "GraphinComponents",
    "@antv/g6": "G6",
    antd: "antd",
    moment: "moment",
    "@alipay/graphinsight": "GISDK",
    '@antv/g2plot': 'G2Plot',
  },
  scripts: [
    "https://unpkg.com/react@17.0.2/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js",
    "https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js",
    "https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js",
    "https://gw.alipayobjects.com/os/lib/antd/4.18.3/dist/antd.min.js",
    "https://gw.alipayobjects.com/os/lib/antv/g6/4.5.3/dist/g6.min.js",
    "https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.11/dist/graphin.min.js",
    "https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js",
    /** GI */
    "https://gw.alipayobjects.com/os/lib/alipay/graphinsight/1.0.6/dist/index.min.js",

    "https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js",
     /**  G2Plot */
     'https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js',
  ],
  styles: [
    "https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css",
    "https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.9/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/index.css",
  ],
};
