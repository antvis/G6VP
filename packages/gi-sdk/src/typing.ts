import type { GraphinContextType, GraphinData, IUserEdge, IUserNode, Layout } from '@antv/graphin';
import type { GraphSchemaData, IGraphData } from './process/schema';
export type { GraphSchemaData };
export interface State {
  /** graphin */
  graph: GraphinContextType['graph'];
  layoutInstance: GraphinContextType['layout'];
  apis: GraphinContextType['apis'];
  theme: GraphinContextType['theme'];
  stopForceSimulation: () => void;
  restartForceSimulation: (nodes?: []) => void;

  /** graphinsight */

  /** 最原始的数据，本地数据或者服务端返回的数据，未经过视觉映射 */
  rawData: GraphinData;
  /** 当前画布渲染的数据，经过视觉映射 */
  data: GraphinData;
  /** 由 data 生成的属性图数据 */
  propertyGraphData: IGraphData | undefined;
  /** 仅原始数据变化的时候才保存的数据，通常用于画布数据重置 */
  source: GraphinData;
  /** 大图数据 */
  largeGraphData?: GraphinData;
  /** 大图展示限制 */
  largeGraphLimit: number;
  /** 大图模式 */
  largeGraphMode: boolean;

  schemaData: GraphSchemaData;

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
  GICC_LAYOUT: {
    id: string;
    props: any;
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
  schemaData?: GraphSchemaData;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

export type AssetType =
  | 'AUTO' // 自加载组件 initializer
  | 'INITIALIZER' // 初始化组件
  | 'GICC' // 容器组件，可以多选
  | 'GICC_LAYOUT' // 布局容器组件,只能单选
  | 'GICC_MENU' // 容器组件（菜单）
  | 'GIAC' // 原子组件
  | 'GIAC_CONTENT' //原子组件（内容）
  | 'GIAC_MENU' // 原子组件（菜单）
  | 'NODE' // 节点
  | 'EDGE' // 边
  // 兼容旧版本
  | 'GI_CONTAINER'
  | 'GI_CONTAINER_INDEX';

export type GIAC_ITEMS_TYPE = { label: string; value: string }[];

export interface EngineServer {
  /** 引擎的ID */
  id: 'GI' | 'AKG' | 'SHASENG';
  /** 引擎的类型 */
  type: 'file' | 'api' | 'database';
  /** 引擎的名称 */
  name: string;
  /** 引擎的配套组件 */
  component?: React.ReactNode;
  /** 引擎的实现 */
  services?: {
    [key: string]: GIService;
  };
}

export interface ComponentAsset {
  component: React.ElementType; // https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#polymorphic-components-eg-with-as-props
  registerMeta: (context: {
    data: any;
    services: any[];
    GI_CONTAINER_INDEXS: GIAC_ITEMS_TYPE;
    keys: string[];
    edgeKeys: string[];
    schemaData: GraphSchemaData;
    config: GIConfig;
    GIAC_ITEMS: GIAC_ITEMS_TYPE;
    GIAC_MENU_ITEMS: GIAC_ITEMS_TYPE;
    GIAC_CONTENT_ITEMS: GIAC_ITEMS_TYPE;
    engineId: string;
    hasPropertyGraph?: boolean;
  }) => any;
  mockServices?: () => any[];
  info: {
    id: string;
    name: string;
    type: AssetType;
    category: AssetCategory;
  };
}
export interface LayoutAsset {
  registerMeta: (context: {
    data: any;
    services?: any[];
    GI_CONTAINER_INDEX?: string[];
    keys: string[];
    schemaData: GraphSchemaData;
  }) => any;
  registerLayout?: () => any[];
  info: {
    id: string;
    name: string;
    type: AssetType;
    icon?: string;
    category: string;
    options: {
      type: string;
    };
    desc?: string;
    cover?: string;
  };
}

export interface ElementAsset {
  registerMeta: (context: {
    data: any;
    services?: any[];
    GI_CONTAINER_INDEXS?: string[];
    keys?: string[];
    schemaData: GraphSchemaData;
  }) => any;
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

/**
 * 服务实例: GISDK.services
 */
export interface ServiceObject {
  // 服务名称
  name: string;
  // 服务的具体实现
  service: (params?: any) => Promise<any>;
  // 入参文档
  req?: string;
  // 出参文档
  res?: string;
  // 接口类型，RESTFul
  method?: 'POST' | 'GET' | 'DELETE' | 'UPDATE';
}

/**
 * 服务实例: GISDK.services
 */
export interface GIService extends ServiceObject {
  // 服务唯一ID,通常由 ServerID + Service Function Name 构成
  id: string;
}

export interface GIComponentAssets {
  [key: string]: ComponentAsset;
}

export interface GIElementsAssets {
  [key: string]: ElementAsset;
}

export interface GILayoutAssets {
  [key: string]: LayoutAsset;
}

export type GIAssets = Partial<{
  components: GIComponentAssets;
  elements: GIElementsAssets;
  layouts: GILayoutAssets;
  services: EngineServer[];
}>;
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
  name?: string;
  // 资产类型
  type: AssetType;
  props: {
    GI_CONTAINER?: string[];
    GI_CONTAINER_INDEX?: number;
    [key: string]: any;
  };
}

export interface GINodeConfig {
  id: string;
  name?: string;
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
  logic: boolean;
  groupName: string;
}
export interface GIEdgeConfig {
  id: string;
  name?: string;
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
  logic: boolean;
  groupName: string;
}

export interface GIConfig {
  // 支持配置多布局，如子图布局
  // layouts?: GILayoutConfig[] | GILayoutConfig;
  layout: GILayoutConfig;
  components: GIComponentConfig[];
  node?: GINodeConfig;
  edge?: GIEdgeConfig;
  /** 支持多元素组合 */
  nodes: GINodeConfig[];
  edges: GIEdgeConfig[];
  pageLayout: GIComponentConfig;
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

export interface GIGraphData {
  nodes: {
    // 节点ID
    id: string;
    // 节点类型的枚举值。Property Graph 也称之为 node.label
    nodeType: string;
    // 业务数据,注意需要打平,暂不支持嵌套
    data: {};
    // 业务数据（data）中的哪个字段，用来映射节点类型
    nodeTypeKeyFromProperties?: string;
  }[];
  edges: {
    // 边ID,默认构造为`${edge.source}-${edge.target}-{index}`
    id: string;
    // 边关联的 source 节点ID
    source: string;
    // 边关联的 target 节点ID
    target: string;
    // 边类型的枚举值。Property Graph 也称之为 edge.label
    edgeType: string;
    // 业务数据,注意需要打平,暂不支持嵌套
    data: {};
    // 业务数据（data）中的哪个字段，用来映射边类型
    edgeTypeKeyFromProperties?: string;
  }[];
}

export type GIGraphSchema = GraphSchemaData;

export type GISiteParams = Partial<{
  engineId: string;
  engineContext: Record<any, string>;
  /** 数据，原始上传的数据与转化后的数据 */
  data: {
    transData: GIGraphData;
    inputData: GraphinData[];
  };
  /** 哪些活跃的资产 */
  activeAssetsKeys: string[];
  /** 图模型 */
  schemaData: GraphSchemaData;
  /** 属于什么模版 */
  tag: string;
  /** 项目模版 */
  projectConfig: {
    nodes?: GINodeConfig[];
    edges?: GIEdgeConfig[];
    components: GIComponentConfig[];
    layout?: GILayoutConfig;
  };
  /** 数据集名称 */
  name: string;
}>;
