import type { GraphinContextType, GraphinData, IUserEdge, IUserNode, Layout } from '@antv/graphin';
import type { IGraphSchema } from './process/schema';
export interface State {
  /** graphin */
  graph: GraphinContextType['graph'];
  layoutInstance: GraphinContextType['layout'];
  apis: GraphinContextType['apis'];
  theme: GraphinContextType['theme'];

  /** graphinsight */

  /** 最原始的数据，本地数据或者服务端返回的数据，未经过视觉映射*/
  rawData: GraphinData;
  /** 当前画布渲染的数据，经过视觉映射*/
  data: GraphinData;
  /** 仅原始数据变化的时候才保存的数据，通常用于画布数据重置 */
  source: GraphinData;

  schemaData: IGraphSchema;

  /** 布局 */
  layout: Layout;
  /** 组件 */
  components: GIComponentConfig[];
  /** 画布是否初始化完成 */
  initialized: boolean;
  /** 图初始化组件  */
  initializer: {
    id: string;
    props: {
      GI_INITIALIZER: boolean;
      serviceId: 'GI_SERVICE_INTIAL_GRAPH' | string;
    };
  };
  /** 画布的配置,等同props.config */
  config: GIConfig;
  /** 画布所有注册的服务 */
  servives: any[];
  /** 数据加载动画 */
  isLoading: boolean;
  /** 图的上下文准备 */
  isContextReady: boolean;
  /**
   * 数据映射函数
   */
  transform: (data: any, reset?: boolean) => any;

  /** 是否使用缓存的布局 */
  layoutCache: boolean;
}

export interface Props {
  /**
   * @description GISDK的ID，用于多实例管理，缺失会默认生成一个
   */
  id?: string;
  /**
   * @description 配置信息
   */
  config: GIConfig;
  /**
   * @description 资产实例
   */
  assets: GIAssets;
  /** 注册的全局数据服务 */
  services: GIService[];
  /**
   * style
   */
  schemaData?: IGraphSchema;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

export type AssetType =
  | 'AUTO' // 自加载组件
  | 'GICC' // 容器组件
  | 'GICC_MENU' // 容器组件（菜单）
  | 'GIAC' // 原子组件
  | 'GIAC_CONTENT' //原子组件（内容）
  | 'GIAC_MENU' // 原子组件（菜单）
  | 'NODE' // 节点
  | 'EDGE' // 边
  // 兼容旧版本
  | 'GI_CONTAINER'
  | 'GI_CONTAINER_INDEX';

export interface ComponentAsset {
  component: React.ElementType; // https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#polymorphic-components-eg-with-as-props
  registerMeta: (context: { data: any; services: any[]; GI_CONTAINER_INDEXS: string[]; keys: string[] }) => any;
  mockServices?: () => any[];
  info: {
    id: string;
    name: string;
    type: AssetType;
  };
}
export interface LayoutAsset {
  registerMeta: (context: { data: any; services: any[]; GI_CONTAINER_INDEXS: string[]; keys: string[] }) => any;
  registerLayout?: () => any[];
  info: {
    id: string;
    name: string;
    type: AssetType;
    category: string;
    options: {
      type: string;
    };
    desc?: string;
    cover?: string;
  };
}

export interface ElementAsset {
  registerMeta: (context: { data: any; services: any[]; GI_CONTAINER_INDEXS: string[]; keys: string[] }) => any;
  registerShape?: () => any[];
  info: {
    id: string;
    name: string;
    type: AssetType;
    category: string;
    desc?: string;
    cover?: string;
  };
  registerTransform: (data: GraphinData, metaConfig: GINodeConfig | GIEdgeConfig, reset?: boolean) => any[];
}

export interface GIAssets {
  components: {
    [key: string]: ComponentAsset;
  };
  elements: {
    [key: string]: ElementAsset;
  };
  layouts: {
    [key: string]: LayoutAsset;
  };
}
export interface LayoutConfig {
  // 支持的布局类型，默认为 force
  type?: 'preset' | 'graphin-force' | 'force' | 'grid' | 'dagre' | 'circular' | 'concentric';
  [key: string]: any;
}
export interface GILayoutConfig {
  id: string;
  props: LayoutConfig;
}

export interface GIMeta {
  id: string;
  type: string;
  default: string | number;
}

export interface GIComponentConfig {
  id: string;
  props: {
    GI_CONTAINER?: string[];
    GI_CONTAINER_INDEX?: number;
    [key: string]: any;
  };
}

export interface GINodeConfig {
  id: string;
  name: string;
  props: {
    size: number;
    color: string;
    label: string[];
    [key: string]: any;
  };
  expressions?: {
    name: string;
    operator: string;
    value: string | number;
  }[];
  groupName: string;
}
export interface GIEdgeConfig {
  id: string;
  name: string;
  props: {
    color: string;
    size: number;
    label: string[];
    [key: string]: any;
  };
  expressions?: {
    name: string;
    operator: string;
    value: string | number;
  }[];
  groupName: string;
}

export interface GIConfig {
  // 支持配置多布局，如子图布局
  // layouts?: GILayoutConfig[] | GILayoutConfig;
  layout?: GILayoutConfig;
  components?: GIComponentConfig[];
  node?: GINodeConfig;
  edge?: GIEdgeConfig;
  /** 支持多元素组合 */
  nodes?: GINodeConfig[];
  edges?: GIEdgeConfig[];
}

interface GINodeData {
  id: string;
}

interface GIEdgeData {
  source: string;
  target: string;
}

export interface GIServiceResponseData {
  nodes: GINodeData[];
  edges: GIEdgeData[];
}

export interface GIServiceResponseDetailData {
  id?: string;
  source?: string;
  target?: string;
}

export interface GIService {
  /** 获取初始化接口，获取初始图数据 */
  id: string;
  service: (params?: any) => Promise<GIServiceResponseData>;
}

export interface ISourceDataMap {
  nodes: {
    [id: string]: IUserNode;
  };
  edges: {
    [id: string]: IUserEdge;
  };
}

export type AssetCategory =
  | 'container-components'
  | 'canvas-interaction'
  | 'elements-interaction'
  | 'data-analysis'
  | 'data-query'
  | 'system-interaction'
  | 'styling-analysis'
  | 'algorithm-analysis'
  | 'workbook';
export type AssetInfo = {
  /** 资产ID */
  id: string;
  /** 资产名称 */
  name: string;
  /** 资产缩略图 */
  cover?: string;
  /** 资产类型 */
  type: AssetType;
  /** 资产ID */
  icon: string;
  /** 资产分类 */
  category: AssetCategory;
  /** 资产描述 */
  desc?: string;
  [key: string]: any;
};
