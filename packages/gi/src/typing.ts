import type { GraphinContextType, GraphinData, Layout } from '@antv/graphin';

export interface State {
  /** graphin */
  graph: GraphinContextType['graph'];
  layoutIntance: GraphinContextType['layout'];
  apis: GraphinContextType['layout'];
  theme: GraphinContextType['theme'];

  /** graphinsight */

  /** 当前画布渲染的数据 */
  data: GraphinData;
  /** 需要画布重置的数据 */
  source: GraphinData;
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
  isLoading: false;
  /** 图的上下文准备 */
  isContextReady: false;
}

export interface Props {
  /**
   * @description 配置信息
   */
  config: GIConfig;
  /**
   * @description 资产实例
   */
  assets: {
    components: any;
    elements: any;
    layouts: any;
  };
  services: GIService[];
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

export interface LayoutConfig {
  // 支持的布局类型，默认为 force
  type?: 'preset' | 'graphin-force' | 'force' | 'grid' | 'dagre' | 'circular' | 'concentric';
  options?: {
    [key: string]: any;
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
  id: string;
  name: string;
  props: {
    size: number;
    color: string;
    label: string;
  };
}

export interface GIEdgeConfig {
  id: string;
  name: string;
  props: {
    color: string;
    lineWidth: number;
  };
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
  id: string;
  service: (params?: any) => Promise<GIServiceResponseData>;
}
