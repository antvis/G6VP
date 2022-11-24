export default {
  nodeModulesTransform: {
    type: "none",
  },
  routes: [{ exact: true, path: "/", component: "index" }],
  mfsu: false,
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "@antv/graphin": "Graphin",
    "@antv/g6": "G6",
    antd: "antd",
  },
  scripts: [
    //  <!--- REACT DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js",
    "https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js",
    //  <!--- Antd DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js",
    "https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js",
    //  <!--- Graphin DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/antv/g6/4.6.4/dist/g6.min.js",
    "https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/graphin.min.js",
    //  <!--- G2/G2Plot DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js",
    //  <!--- GI DEPENDENCIES-->
    "https://gw.alipayobjects.com/os/lib/alipay/graphinsight/2.2.0/dist/index.min.js",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/2.2.0/dist/index.min.js",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-advance/2.2.0/dist/index.min.js",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-scene/2.2.0/dist/index.min.js",
  ],
  styles: [
    "https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.5/dist/GraphInsight/light.css",
    "https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/graphinsight/2.2.0/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/2.2.0/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-advance/2.2.0/dist/index.css",
    "https://gw.alipayobjects.com/os/lib/alipay/gi-assets-scene/2.2.0/dist/index.css",
  ],
};
