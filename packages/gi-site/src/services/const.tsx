export const isMock = window.localStorage.getItem('GI_SERVER_ENV') === 'ONLINE' ? false : true;

export const SERVICE_URL_PREFIX = 'https://storehouse.test.alipay.net';
// export const SERVICE_URL_PREFIX = 'https://storehouse.test.alipay.net';
// export const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7001';

export const ASSET_TYPE = {
  COMPONENT: 1, // 1 表示组件
  LAYOUT: 2, // 2 表示布局
  SERVICE: 3, // 3 表示数据服务
  NODE: 4, // 4 表示节点
  EDGE: 5, // 5 表示边
  PROJECT: 6, // 6 大分类 项目
  ASSET: 7, // 7 大分类 分析资产
};

export const IS_DYNAMIC_LOAD = false;
