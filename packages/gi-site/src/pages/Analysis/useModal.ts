/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GIAssets, GIConfig, GIService } from '@alipay/graphinsight/src/typing';
import { GraphinData } from '@antv/graphin';

export const initialState: StateType = {
  /** 项目ID */
  id: '',
  /** 强制渲染的React Key */
  key: Math.random(),
  /** 画布渲染的配置 */
  config: {},
  /** 所有的数据服务列表 */
  services: [],

  /** 是否准备完毕 */
  isReady: false,
  /** 是否保存 */
  isSave: true,
  /** 当前 Sidebar 的值 */
  activeNavbar: '',
  /** 当前 Sidebar 是否可折叠 */
  collapse: false,
  /** 当前 数据导入面板 是否可显示 */
  isUploadModalVisible: false,

  data: {
    nodes: [],
    edges: [],
  },
  /** 原数据 / 文件名 */
  inputData: [],
  /** 映射函数 */
  transfunc: '',

  /** 数据服务列表 */
  serviceConfig: [],

  /** 是否开启智能推荐 */
  enableAI: false,
  /** 原始渲染的配置，用于取消智能推荐时还原 */
  projectConfig: {},
  /** 资产中心 */
  assetsCenter: {
    visible: false,
    hash: 'components',
  },
  /** 全量资产Map */
  assets: {
    components: {},
    elements: {},
    layouts: {},
  },
  /** 激活的资产Map */
  activeAssets: null,
  activeAssetsKeys: null,
  activeAssetsInformation: null,
  schemaData: {
    nodes: [],
    edges: [],
  },
};

export interface StateType {
  /** 项目ID */
  id: string;
  /** GISDK.config */
  config: GIConfig;
  /** GISDK.services */
  services: GIService[];
  /** 数据服务列表 */
  serviceConfig: {
    id: string;
    mode: string;
    content: string;
  }[];
  /** 强制渲染的React Key */
  key: number;
  /** 原始数据 */
  data: GraphinData;
  /** 上传的数据 */
  inputData: any[];
  transfunc: string;
  /** 全部资产 */
  assets: GIAssets;
  /** 用户选择的资产,活跃资产 */
  activeAssets: GIAssets | null;
  /** 用户选择的资产的Key值,活跃资产 */
  activeAssetsKeys: {
    components: string[];
    elements: string[];
    layouts: string[];
  } | null;
  /** 激活资产的详细信息：meta/info */
  activeAssetsInformation: {
    components: any[];
    elements: { nodes: {}; edges: {} };
    layouts: any;
  } | null;
  /** 是否准备完毕 */
  isReady: boolean;
  /** 是否保存 */
  isSave: boolean;
  /** 当前 Sidebar 的值 */
  activeNavbar: string;
  /** 当前 Sidebar 是否可折叠 */
  collapse: boolean;
  /** 当前 数据导入面板 是否可显示 */
  isUploadModalVisible: boolean;

  /** 是否开启智能推荐 */
  enableAI: boolean;
  /** 原始渲染的配置，用于取消智能推荐时还原 */
  projectConfig: GIConfig;
  assetsCenter: {
    visible: boolean;
    hash: string;
  };
  schemaData: any;
}
