/* eslint-disable @typescript-eslint/no-explicit-any */
import { GIConfig } from '@antv/gi-sdk';
import { Updater, useImmer } from 'use-immer';
import { StateType } from './typing';

const initialState: StateType = {
  engineId: '',
  engineContext: {},
  /** 项目ID */
  id: '',
  /** 强制渲染的React Key */
  key: Math.random(),
  /** 画布渲染的配置 */
  config: {} as GIConfig,
  /** 所有的数据服务列表 */
  services: [],

  /** 是否准备完毕 */
  isReady: false,
  /** 是否保存 */
  isSave: true,
  /** 当前 Sidebar 的值 */
  activeNavbar: '',
  /** 当前 Sidebar 是否折叠 */
  collapse: true,

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
  projectConfig: {} as GIConfig,
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
  themes: [],
};

const useModel: () => [StateType, Updater<StateType>] = () => {
  const [state, updateState] = useImmer<StateType>(initialState);
  return [state, updateState];
};

export default useModel;
