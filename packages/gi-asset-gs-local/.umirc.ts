export default {
  nodeModulesTransform: {
    type: "none",
  },
  routes: [{ exact: true, path: "/", component: "index" }],
  mfsu: {},
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "@antv/graphin": "Graphin",
    "@antv/g6": "G6",
    antd: "antd",
    "@antv/g2plot": "G2Plot",
    "antd/es/*": "antd",
    "@ant-design/charts": "charts",
    "@ant-design/icons": "icons",
    moment: "moment",
    "@alipay/graphinsight": "GISDK",
    "@alipay/gi-assets-basic": "GI_ASSETS_BAISC",
    "@alipay/gi-assets-advanced": "GI_ASSETS_ADVANCED",
    "@alipay/gi-assets-scene": "GI_ASSETS_SCENE",
  },
  scripts: [
    "https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js",
    "https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js",

    // <!--- Antd DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js",
    "https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js",
    "https://gw.alipayobjects.com/os/lib/antd/4.20.4/dist/antd.min.js",
    // <!--- Graphin DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/antv/g6/4.6.4/dist/g6.min.js",
    "https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/graphin.min.js",
    // <!--- G2/G2Plot DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js",
    /** GI */
    "https://gw.alipayobjects.com/os/lib/alipay/graphinsight/2.2.4/dist/index.min.js",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/2.2.7/dist/index.min.js",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-advance/2.2.9/dist/index.min.js",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-scene/2.2.3/dist/index.min.js",
    // "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-algorithm/1.0.2/dist/index.min.js",

    "https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js",
    "https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js",
  ],
  styles: [
    // "https://gw.alipayobjects.com/os/lib/antd/4.18.3/dist/antd.min.css",

    /** GI */
    "https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/graphinsight/2.2.4/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/2.2.7/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-advance/2.2.9/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-scene/2.2.3/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.3.0/dist/GraphInsight/light.css",
  ],
};
