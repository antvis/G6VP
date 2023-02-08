// GI 默认使用离线数据模式的站点
const GI_DEPOLY_OFFLINE_SITE = [
  'graphinsight.antv.vision',
  'graphinsight.antgroup.com',
  'localhost',
  '127.0.0.1',
  'gi-external-pre.alipay.com',
];

export const GI_SITE = {
  get IS_OFFLINE() {
    const GI_SITE_ENV = localStorage.getItem('GI_SITE_ENV');
    if (!GI_SITE_ENV) {
      return GI_DEPOLY_OFFLINE_SITE.includes(window.location.hostname); //初始化的时候，根据部署白名单
    }
    return GI_SITE_ENV === 'ONLINE' ? false : true;
  },
  get SERVICE_URL() {
    const { hostname, protocol } = window.location;
    const port = 7001;
    return GI_SITE.IS_OFFLINE ? 'https://graphinsight-pre.alipay.com' : `${protocol}//${hostname}:${port}`;
  },
};

/** 是否是开发环境 */
//@ts-ignore
export const IS_DEV_ENV = process.env.NODE_ENV === 'development';

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
  light: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*DsXhSJ1x8DUAAAAAAAAAAAAADmJ7AQ/original',
  dark: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TawEQ6nGf-AAAAAAAAAAAAAADmJ7AQ/original',
};
export const G6VP_LOGO_URL = {
  light: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WDF_R6NLDHwAAAAAAAAAAAAADmJ7AQ/original',
  dark: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ckelSIEoPj4AAAAAAAAAAAAADmJ7AQ/original',
};

export const LOGO_URL = GI_SITE.IS_OFFLINE ? G6VP_LOGO_URL : GI_LOGO_URL;

export const GI_QR_URL =
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AC9gR462u1wAAAAAAAAAAAAADmJ7AQ/original';
export const G6VP_QR_URL =
  'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*H5-ERLOWTqIAAAAAAAAAAAAADmJ7AQ/original';
export const QR_URL = GI_SITE.IS_OFFLINE ? G6VP_QR_URL : GI_QR_URL;
