/* eslint-disable @typescript-eslint/no-explicit-any */
import { GIComponentConfig, GIConfig, GIService } from '@alipay/graphinsight/src/typing';
import produce from 'immer';
import { createStore } from 'redux';
type Action = {
  type: string;
  payload: any;
};

const initialState = {
  /** 项目ID */
  id: '',
  /** 强制渲染的React Key */
  key: Math.random(),
  /** 画布渲染的配置 */
  config: {},
  /** 资产Map */
  assets: {},
  /** 资产Map */
  totalAssets: {},
  siteConfig: {},
  /** 是否准备完毕 */
  isReady: false,
  /** 是否保存 */
  isSave: true,
  /** 当前 Sidebar 的值 */
  activeNavbar: '',
  /** 当前 Sidebar 是否可折叠 */
  collapse: false,
  /** 当前 数据导入面板 是否可显示 */
  isModalVisible: false,
  /** 所有的数据服务列表 */
  services: [],
  /** 组件市场的所有组件 */
  components: [],
  elements: [],
  data: {},
  /** 原数据 / 文件名 */
  inputData: [],
  /** 映射函数 */
  transfunc: '',
  refreshComponentKey: Math.random(),

  /** 数据服务列表 */
  serviceLists: [],

  /** 是否开启智能推荐 */
  enableAI: false,
  /** 原始渲染的配置，用于取消智能推荐时还原 */
  projectConfig: {},
  /** 资产中心 */
  assetsCenter: {
    visible: false,
    hash: 'components',
  },
  activeAssets: {},
  activeAssetsKeys: {
    components: [],
    elements: [],
    layouts: [],
  },
  activeAssetsInformation: {
    components: [],
    elements: [],
    layouts: [],
  },
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
  inputData: any[];
  transfunc: '';
  /** 画布渲染的配置 */
  config: GIConfig;

  /** 全部资产 */
  assets: {
    components: any[];
    elements: any[];
    layouts: any[];
    services: any[];
  };
  /** 用户选择的资产,活跃资产 */
  activeAssets: {
    components: any[];
    elements: any[];
    layouts: any[];
    services: any[];
  };
  /** 用户选择的资产的Key值,活跃资产 */
  activeAssetsKeys: {
    components: string[];
    elements: string[];
    layouts: string[];
    services: any[];
  };

  activeAssetsInformation: {
    components: any[];
    elements: any[];
    layouts: any[];
    services: any[];
  };

  /** 是否准备完毕 */
  isReady: boolean;
  /** 是否保存 */
  isSave: boolean;
  /** 当前 Sidebar 的值 */
  activeNavbar: string;
  /** 当前 Sidebar 是否可折叠 */
  collapse: boolean;
  /** 当前 数据导入面板 是否可显示 */
  isModalVisible: boolean;
  /** 所有的数据服务列表 */
  services: GIService[];
  /** 组件市场的所有组件 */
  components: GIComponentConfig[];
  /** 资产中心的 元素 */
  elements: GIComponentConfig[];

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

  assetsCenter: {
    visible: boolean;
    hash: string;
  };
}

const RootReducers = (state: StateType = initialState, action: Action): StateType => {
  const { type, update, ...payload } = action;
  switch (type) {
    case 'FREE':
      const newState = produce(state, update);
      return newState;

    case 'UPDATE':
      const nextState = produce(state, draftState => {
        Object.keys(payload).forEach(key => {
          draftState[key] = payload[key];
        });
      });
      return nextState;

    case 'update':
      return {
        ...state,
        ...payload,
      };
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
      };

    default:
      return state;
  }
};

const store = createStore(RootReducers);

export default store;
