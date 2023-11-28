import { join } from 'path';
const isProduction = process.env.NODE_ENV === 'production';

export default {
  title: 'G6VP',
  mode: 'site',
  base: '/',
  publicPath: '/',
  logo: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  favicon: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  // sitemap: {
  //   hostname: 'graphin.antv.vision',
  // },
  extraBabelIncludes: ['@antv/dumi-theme-antv'],
  resolve: {
    includes: [
      // 'packages/graphin/docs/*.md',
      // 'packages/graphin/docs/render/data/',
      // 'packages/graphin/docs/render/element/',
      // 'packages/graphin/docs/features/',

      'packages/gi-sdk/docs',
      'packages/gi-assets-basic/src/components/',
      'packages/gi-assets-advance/src/components/',
      'packages/gi-assets-algorithm/src/',
      // 'packages/gi-assets-scene/src/',

      // 'packages/graphin-components/src/',
      // 'packages/graphin-graphscope/docs/',
      /** local develop */
      // 'packages/graphin-components/src/VisSettingPanel',
    ],
  },
  alias: {
    '@antv/graphin': join(__dirname, 'packages', 'graphin'),
    '@antv/gi-sdk': join(__dirname, 'packages', 'gi-sdk'),
    '@antv/gi-assets-basic': join(__dirname, 'packages', 'gi-assets-basic'),
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  metas: [
    {
      name: 'keywords',
      content: 'graphin,g6,graph,Graphin,AntV Graph',
    },
  ],

  navs: [
    null,
    {
      title: '快速体验',
      path: 'https://insight.antv.antgroup.com',
    },
  ],

  analytics: isProduction ? { ga: 'UA-148148901-8' } : false,
  hash: true,
  ssr: {
    devServerRender: false,
  },
  exportStatic: {},
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    antd: 'window.antd',
    '@antv/g6': 'window.G6V5',
  },
  workerLoader: {},
  webpack5: {},
  targets: {
    chrome: 80,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  theme: {
    '@s-site-menu-width': '280px',
    '@primary-color': '#873bf4',
  },
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  links: [
    'https://gw.alipayobjects.com/os/lib/antd/4.6.6/dist/antd.css',
    'https://gw.alipayobjects.com/os/lib/antv/gi-assets-basic/2.4.36/dist/index.css',
  ],
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/16.13.1/umd/react.development.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/16.13.1/umd/react-dom.development.js',
    'https://gw.alipayobjects.com/os/lib/antd/4.6.6/dist/antd-with-locales.js',

    /** G6 **/
    'http://127.0.0.1:9001/g6.min.js',

    /** lodash */
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.20/lodash.min.js',
  ],
};
