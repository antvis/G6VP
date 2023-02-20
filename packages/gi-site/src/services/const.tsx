const GI_LOCAL_URL = [
  'graphinsight.antv.vision', //外网地址
  'graphinsight.antgroup.com', //外网地址
  'localhost', //本地地址
  '127.0.0.1', // 本地打包后启动server的地址
  'gi-external-pre.alipay.com', //外网预发地址
];

/** 是否使用本地 IndexedDB 数据库 */
export const IS_INDEXEDDB_MODE = true; // GI_LOCAL_URL.includes(window.location.hostname); //window.location.host === 'graphinsight.antgroup.com';

/** 是否是开发环境 */
export const IS_DEV_ENV = true; // process.env.NODE_ENV === 'development' || process.env.BUILD_MODE === 'docker';
console.log('IS_DEV_ENV', IS_DEV_ENV, process.env.BUILD_MODE, process.env.NODE_ENV);
const DEV_SERVICE_URL_PREFIX = 'https://graphinsight-pre.alipay.com';
const ONELINE_SERVER_URL_PREFIX =
  window.location.hostname === 'dev.alipay.net' ? DEV_SERVICE_URL_PREFIX : window.location.origin;
export const SERVICE_URL_PREFIX = IS_INDEXEDDB_MODE ? 'https://graphinsight-pre.alipay.com' : ONELINE_SERVER_URL_PREFIX;

export const ASSET_TYPE = {
  COMPONENT: 1, // 1 表示组件
  LAYOUT: 2, // 2 表示布局
  SERVICE: 3, // 3 表示数据服务
  NODE: 4, // 4 表示节点
  EDGE: 5, // 5 表示边
  PROJECT: 6, // 6 大分类 项目
  ASSET: 7, // 7 大分类 分析资产
};

export const GI_LOGO_URL = {
  light: '/public/image/graphinsight.light.svg',
  dark: '/public/image/graphinsight.dark.svg',
};
export const G6VP_LOGO_URL = {
  light: '/public/image/g6vp.light.svg',
  dark: '/public/image/g6vp.dark.svg',
};

export const LOGO_URL = IS_INDEXEDDB_MODE ? G6VP_LOGO_URL : GI_LOGO_URL;

export const GI_QR_URL =
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AC9gR462u1wAAAAAAAAAAAAADmJ7AQ/original';
export const G6VP_QR_URL =
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*H5-ERLOWTqIAAAAAAAAAAAAADmJ7AQ/original';
export const QR_URL = IS_INDEXEDDB_MODE ? G6VP_QR_URL : GI_QR_URL;
