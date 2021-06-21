export interface LayoutConfig {
  // 支持的布局类型，默认为 force
  type?: 'force' | 'grid' | 'dagre' | 'circular' | 'concentric';
  options?: {
    // 根据 type 不同，options 中属性字段也会有所不同
    // 边长
    linkDistance: number;
    // 是否防止重叠，必须配合属性 nodeSize
    preventOverlap: boolean;
    // 节点大小（直径）。用于碰撞检测。
    nodeSize: number[] | number;
    // preventOverlap 为 true 时生效，防止重叠时节点边缘间距的最小值。为不同节点设置不同的最小间距
    nodeSpacing: number;
    // 指定排序的依据字段
    sortBy: string;
    // 是否按照聚类信息布局
    clustering: boolean;
    // dagre 特有
    // 节点对齐方式。默认值是 undefined，代表对齐到中心
    align: 'UL' | 'UR' | 'DL' | 'DR' | undefined;
    // 水平或垂直间距
    nodesep: number;
    // 层间距
    ranksep: number;
    // concentric 配置，环与环之间最小间距，用于调整半径
    minNodeSpacing: number;
    // gird 布局配置，表示网格行数和列数
    rows: number;
    cols: number;
  };
}
export interface GILayoutConfig {
  id: string;
  name: string;
  props: LayoutConfig;
}

export interface GIMeta {
  id: string;
  type: string;
  default: string | number;
}

export interface GIComponentConfig {
  id: string;
  label: string;
  category: string;
  // 组件名称或唯一标识值，暂时使用 any
  // component: string;
  component: any;
  props: {
    [key: string]: any;
  };
  meta: GIMeta[];
  // 是否可用
  enable: boolean;
}

export interface GINodeConfig {
  size: number;
  color: string;
  label: string;
}

export interface GIEdgeConfig {
  color: string;
  lineWidth: number;
}

export interface GIConfig {
  // 支持配置多布局，如子图布局
  // layouts?: GILayoutConfig[] | GILayoutConfig;
  layout?: GILayoutConfig;
  components?: GIComponentConfig[];
  node?: GINodeConfig;
  edge?: GIEdgeConfig;
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
  getGraphData: () => Promise<GIServiceResponseData>;
  /** 根据ID集合获取子图数据 */
  getSubGraphData?: (ids: string[]) => Promise<GIServiceResponseData>;
  /** 获取关系扩散数据 */
  getExploreGraphByDegree?: (id: string, degree?: number) => Promise<GIServiceResponseData>;
  // 通过 ID 获取节点或边的详情信息
  getItemDetailData: (id: string) => Promise<GIServiceResponseDetailData>;
}
