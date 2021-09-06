import { FieldInfo } from '@antv/dw-analyzer';
export type FieldTypes = 'null' | 'boolean' | 'integer' | 'float' | 'date' | 'string';
export type EncodingType = 'quantitative' | 'temporal' | 'ordinal' | 'nominal' |'continuous' | 'discrete' | 'interval' | 'const'; 
// export type ScaleType = 'ordinal' | ''

export interface IExtendFieldInfo extends FieldInfo {
  fieldName: string;
  [key: string]: any;
}

export type LayoutTypes = 'graphin-force' | 'force' | 'grid' | 'dagre' | 'circular' | 'concentric' | 'radial';
export interface ILayoutConfig {
  // 支持的布局类型，默认为 force
  type?: LayoutTypes;
  options?: {
    // 根据 type 不同，options 中属性字段也会有所不同
    // 边长
    linkDistance?: number;
    nodeStrength?: number;
    edgeStrength?: number;
    // 是否防止重叠，必须配合属性 nodeSize
    preventOverlap?: boolean;
    // 节点大小（直径）。用于碰撞检测。
    nodeSize?: number[] | number | ((d:any) => number);
    // preventOverlap 为 true 时生效，防止重叠时节点边缘间距的最小值。为不同节点设置不同的最小间距
    nodeSpacing?: number;
    // 指定排序的依据字段
    sortBy?: string;
    // 是否按照聚类信息布局
    clustering?: boolean;
    // dagre 特有
    rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
    // 节点对齐方式。默认值是 undefined，代表对齐到中心
    align?: 'UL' | 'UR' | 'DL' | 'DR' | undefined;
    // 水平或垂直间距
    nodesep?: number;
    // 层间距
    ranksep?: number;
    // concentric 配置，环与环之间最小间距，用于调整半径
    minNodeSpacing?: number;
    // gird 布局配置，表示网格行数和列数
    rows?: number;
    cols?: number;
    // concentric
    equidistant?: boolean; // 是否等距
    // circular
    radius?: number;
    divisions?: number; // 分段数
    ordering?: null | 'topology' | 'degree';
    // radial 
    unitRadius?: number; // 层级距离
    focusNode?: string;
    // graphin-force
    stiffness?: number;
    repulsion?: number;
    damping?: number;
  };
}

export interface NumMappingCfg {
  key: string; // 用作映射的字段名
  scale: {
    type: string;  // TODO 改成 antv/scale 支持的scale类型
    range: number[];
    domain: number[];
  };
  [key:string]: any;
}

export interface CategoryMappingCfg {
  key: string; // 用作映射的字段名
  scale: {
    type: string; // ordinal, ..
    range: string[] | number[];
    domain: string[]| number[];
  };
  [key:string]: any;
}

export type NodeTypes = 'circle' | 'rect' | 'donut';

export interface INodeCfg {
  size: NumMappingCfg;
  color: CategoryMappingCfg;
  label: {
    key: string; 
    showlabel?: Boolean;
  };
  [key: string]: any;
};

export interface INodeTypeCfg {
  type: NodeTypes;
  customCfg?: {
    [key: string]: any;
  }
}

export interface INodeData {
  id: string,
  name?: string;
  data?: {
    [key: string]: any;
  };
  cfg?: INodeCfg
}

export interface IEdgeCfg {
  color: CategoryMappingCfg;
  lineWidth: NumMappingCfg;
  [key: string]: any;
}

export interface IEdgeData {
  source: string;
  target: string;
  data?: {
    [key: string]: any;
  },
  cfgs?: IEdgeCfg;
}

export interface IGraphData {
  nodes: INodeData[];
  edges: IEdgeData[];
  data?: {
    [key: string]: any;
  };
  props?: {
    [key: string]: any;
  };
}

export interface INodeStructFeat {
  degree: number; // 节点度数
  inDegree: number; // 入度
  outDegree: number; // 出度
  pageRank: number; 
  closeness: number;
  kCore: number;
  cycleCount: number;
  triangleCount: number;
  starCount: number;
  cliqueCount: number;
  clusterCoeff: number;
}

export interface IEdgeStructFeat {
  isDirected: Boolean;
  centrality: number;
  cycleCount: number;
  triangleCount: number;
  starCount: number;
  cliqueCount: number;
}
// 图统计特征 
export interface IGraphFeat {
  nodeCount: number;
  edgeCount: number;
  direction: number;
  isDirected: Boolean;
  isDAG: Boolean;
  isCycle: Boolean;
  isConnected: Boolean;
  ratio: number; // 有向无环图的深度和宽度比
  breadth: number;
  depth: number;
  maxDegree: number;
  minDegree: number;
  avgDegree: number;
  maxPageRank: number;
  minPageRank: number;
  avgPageRank: number;
  components: any[];
  componentCount: number;
  strongConnectedComponents: any[];
  strongConnectedComponentCount: number;
  cycleCount: number;
  directedCycleCount: number;
  starCount: number;
  cliqueCount: number;
  cycleParticipate: number;
  triangleCount: number;
  localClusterCoeff: number;
  globalClusterCoeff: number;
  maxKCore: number;
}

export interface IGraphProps {
  nodeFeats: IExtendFieldInfo[];
  edgeFeats: IExtendFieldInfo[];
  graphInfo: Partial<IGraphFeat>;
  nodeFieldsInfo: IExtendFieldInfo[];
  edgeFieldsInfo: IExtendFieldInfo[];
  [key: string]: any; // 便于能够扩展自定义的数据特征
}

export interface IEncodeCfg {
  [key: string]: IExtendFieldInfo;
}
