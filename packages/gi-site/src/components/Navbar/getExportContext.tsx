import { ANTD_VERSION, G2PLOT_VERSION, G6_VERSION, GI_VERSION, GRAPHIN_VERSION } from '../../env';
import { getActivePackageName } from '../../hooks/common';

const getPkg = activeAssets => {
  const GI_ASSETS_PACKAGES = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}') as {
    [key: string]: {
      name: string;
      global: string;
      url: string;
      version: string;
    };
  };
  const names = getActivePackageName(activeAssets);
  return Object.values(GI_ASSETS_PACKAGES).reduce((acc, curr) => {
    const isMatch = names.indexOf(curr.name) !== -1;
    if (isMatch) {
      return {
        ...acc,
        [curr.global]: curr,
      };
    }
    return acc;
  }, {});
};

const getExportContext = ctx => {
  const {
    activeAssetsKeys,
    datasetId,
    datasetName,
    config,
    themes,
    engineContext,
    engineId,
    id,
    schemaData,
    data,
    name,
    activeAssets,
  } = ctx;

  const GI_ASSETS_PACKAGES = getPkg(activeAssets);
  return {
    workbook: {
      id,
      name,
      activeAssetsKeys,
      projectConfig: config,
      themes,
      theme: localStorage.getItem('@theme') || 'light',
    },
    dataset: {
      id: datasetId,
      engineContext,
      engineId,
      name: datasetName,
      schemaData,
      data: { transData: data },
    },
    deps: {
      React: {
        url: 'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
        name: 'react-dom',
        version: '17.0.2',
        global: 'React',
      },
      ReactDOM: {
        url: 'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
        name: 'react-dom',
        version: '17.0.2',
        global: 'ReactDOM',
      },
      _: {
        name: 'lodash',
        version: '4.17.21',
        global: '_',
        url: 'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
      },
      antd: {
        url: `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js`,
        name: 'antd',
        version: ANTD_VERSION,
        global: 'antd',
      },
      G6: {
        url: `https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js`,
        name: '@antv/g6',
        version: G6_VERSION,
        global: 'G6',
      },
      Graphin: {
        url: `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/graphin.min.js`,
        name: '@antv/graphin',
        version: GRAPHIN_VERSION,
        global: 'Graphin',
      },
      GISDK: {
        name: '@antv/gi-sdk',
        version: GI_VERSION,
        url: `https://gw.alipayobjects.com/os/lib/antv/gi-sdk/${GI_VERSION}/dist/index.min.js`,
        global: 'GISDK',
      },
      G2Plot: {
        url: `https://gw.alipayobjects.com/os/lib/antv/g2plot/${G2PLOT_VERSION}/dist/g2plot.min.js`,
        name: '@antv/g2plot',
        version: G2PLOT_VERSION,
        global: 'G2Plot',
      },
      '@antv/gi-theme-antd': {
        name: '@antv/gi-theme-antd',
        version: '0.6.0',
        url: 'https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.6.0/dist/index.min.js',
        global: 'GI_THEME_ANTD',
      },
    },
    GI_ASSETS_PACKAGES,
  };
};

export default getExportContext;
