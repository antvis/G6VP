/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GIAssets, GIConfig, GIService } from '@antv/gi-sdk/src/typing';
import { GraphinData } from '@antv/graphin';
export interface IActiveAssetsKeys {
  components: string[];
  elements: string[];
  layouts: string[];
}

export type IServiceConfig = {
  id: string;
  mode: string;
  content: string;
}[];

export interface StateType {
  /** 项目绑定的引擎ID */
  engineId: string;
  /** 项目绑定的引擎ID */
  engineContext: Record<string, any>;
  /** 项目ID */
  id: string;
  /** 项目名称 */
  name?: string;
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
  activeAssetsKeys: IActiveAssetsKeys | null;
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

  /** 是否开启智能推荐 */
  enableAI: boolean;
  /** 原始渲染的配置，用于取消智能推荐时还原 */
  projectConfig: GIConfig;
  assetsCenter: {
    visible: boolean;
    hash: string;
  };
  schemaData: any;
  themes?: any[];
}
