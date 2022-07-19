const GI_LOCAL_URL = ['graphinsight.antv.vision', 'graphinsight.antgroup.com', 'localhost:8000'];
export const IS_LOCAL_ENV = GI_LOCAL_URL.includes(window.location.host); //window.location.host === 'graphinsight.antgroup.com';

// 本地环境
// export const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7001';

// 开发环境
// export const SERVICE_URL_PREFIX = 'http://storehouse-afx-29149.gz00b.dev.alipay.net';

// 测试环境
export const SERVICE_URL_PREFIX = IS_LOCAL_ENV ? 'https://storehouse.test.alipay.net' : window.location.origin; // 'https://storehouse.test.alipay.net';

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
