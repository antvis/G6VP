/* eslint-disable @typescript-eslint/no-explicit-any */
import { GIComponentConfig, GIConfig, GIService } from '@alipay/graphinsight/src/typing';
import { createStore } from 'redux';
interface Action {
  type: string;
  payload: any;
}

const initialState = {
  /** 项目ID */
  id: '',
  /** 强制渲染的React Key */
  key: Math.random(),
  /** 画布渲染的配置 */
  config: {},

  /** 是否准备完毕 */
  isReady: false,
  /** 是否保存 */
  isSave: true,
  /** 当前 Sidebar 的值 */
  activeNavbar: '',
  /** 当前 Sidebar 是否可折叠 */
  collapse: false,
  /** 所有的数据服务列表 */
  services: [],
  /** 组件市场的所有组件 */
  components: [],
  elements: [],
  data: {},
  refreshComponentKey: Math.random(),
  assets: {},
  /** 数据服务列表 */
  serviceLists: [],
  /** 是否开启智能推荐 */
  enableAI: false,
  /** 原始渲染的配置，用于取消智能推荐时还原 */
  projectConfig: {},
};

export interface StateType {
  /** 项目ID */
  id: string;
  /** 强制渲染的React Key */
  key: number;
  /** 强制刷新Components 的Key */
  refreshComponentKey: number;
  /** 原始数据 */
  data: any;
  /** 画布渲染的配置 */
  config: GIConfig;
  /** 是否准备完毕 */
  isReady: boolean;
  /** 是否保存 */
  isSave: boolean;
  /** 当前 Sidebar 的值 */
  activeNavbar: string;
  /** 当前 Sidebar 是否可折叠 */
  collapse: boolean;
  /** 所有的数据服务列表 */
  services: GIService[];
  /** 组件市场的所有组件 */
  components: GIComponentConfig[];
  /** 资产中心的 元素 */
  elements: GIComponentConfig[];
  /** 原始资产 */
  assets: any;
  /** 数据服务列表 */
  serviceLists: {
    id: string;
    mode: string;
    content: string;
  }[];
  /** 是否开启智能推荐 */
  enableAI: boolean;
  /** 原始渲染的配置，用于取消智能推荐时还原 */
  projectConfig: GIConfig;
}

const RootReducers = (state: StateType = initialState, action: Action): StateType => {
  const { type, ...payload } = action;
  switch (type) {
    case 'update:config':
      return {
        ...state,
        ...payload,
      };
    case 'update:key':
      return {
        ...state,
        ...payload,
      };
    case 'update:config:node':
      return {
        ...state,
        config: {
          ...state.config,
          node: {
            ...state.config.node,
            ...payload,
          },
        },
      };
    case 'update:config:edge':
      return {
        ...state,
        config: {
          ...state.config,
          edge: {
            ...state.config.edge,
            ...payload,
          },
        },
      };
    case 'update:config:layout':
      return {
        ...state,
        config: {
          ...state.config,
          layout: {
            ...state.config.layout,
            ...payload,
          },
        },
      };
    case 'update:config:components':
      return {
        ...state,
        config: {
          ...state.config,
          ...payload,
        },
      };
    case 'update:data':
      return {
        ...state,
        ...payload,
      };
    case 'update:components':
      return {
        ...state,
        ...payload,
      };
    case 'update:enableAI':
      return {
        ...state,
        ...payload,
      }

    default:
      return state;
  }
};

const store = createStore(RootReducers);

export default store;
