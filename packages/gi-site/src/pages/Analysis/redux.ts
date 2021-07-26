/* eslint-disable @typescript-eslint/no-explicit-any */
import { GIComponentConfig, GIConfig, GIService } from '@alipay/graphinsight';
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
  data: {},
  refreshComponentKey: Math.random(),
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
}

const RootReducers = (state: StateType = initialState, action: Action): StateType => {
  const { type, ...payload } = action;
  switch (type) {
    case 'update:config':
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

    default:
      return state;
  }
};

const store = createStore(RootReducers);

export default store;
