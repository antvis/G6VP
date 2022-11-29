const GI_LOCAL_URL = [
  'graphinsight.antv.vision', //外网地址
  'graphinsight.antgroup.com', //外网地址
  'localhost', //本地地址
  '127.0.0.1', // 本地打包后启动server的地址
  'gi-external-pre.alipay.com', //外网预发地址
];

/** 是否使用本地 IndexedDB 数据库 */
export const IS_INDEXEDDB_MODE = GI_LOCAL_URL.includes(window.location.hostname); //window.location.host === 'graphinsight.antgroup.com';

/** 是否是开发环境 */
export const IS_DEV_ENV = process.env.NODE_ENV === 'development';

// 本地环境
// export const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7002';

// 开发环境
// export const SERVICE_URL_PREFIX = 'http://storehouse-afx-39730.gz00b.dev.alipay.net';

// 测试环境
export const SERVICE_URL_PREFIX = IS_INDEXEDDB_MODE
  ? 'https://storehouse.test.alipay.net'
  : 'http://dev.alipay.net:7001'; // window.location.origin; // 'https://storehouse.test.alipay.net';

// 线上环境
// export const SERVICE_URL_PREFIX = 'https://graphinsight.antgroup-inc.cn';

// 预发环境
// export const SERVICE_URL_PREFIX = 'https://graphinsight-pre.alipay.com';

export const ASSET_TYPE = {
  COMPONENT: 1, // 1 表示组件
  LAYOUT: 2, // 2 表示布局
  SERVICE: 3, // 3 表示数据服务
  NODE: 4, // 4 表示节点
  EDGE: 5, // 5 表示边
  PROJECT: 6, // 6 大分类 项目
  ASSET: 7, // 7 大分类 分析资产
};
