/* eslint-disable @typescript-eslint/no-explicit-any */
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
  config: {},
  /** 所有的数据服务列表 */
  services: [],

  /** 是否准备完毕 */
  isReady: false,
  /** 是否保存 */
  isSave: true,
  /** 当前 Sidebar 的值 */
  activeNavbar: '',
  /** 当前 Sidebar 是否折叠 */
  collapse: false,

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
  projectConfig: {},
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
};

const useModel: () => [StateType, Updater<StateType>] = () => {
  const GI_TOUR_STYLE = localStorage.getItem('GI_TOUR_STYLE');
  const GI_TOUR_DATA = localStorage.getItem('GI_TOUR_DATA');
  const GI_TOUR_COMPONENTS = localStorage.getItem('GI_TOUR_COMPONENTS');
  const GI_TOUR_LAYOUT = localStorage.getItem('GI_TOUR_LAYOUT');
  const collapse = GI_TOUR_STYLE && GI_TOUR_DATA && GI_TOUR_COMPONENTS && GI_TOUR_LAYOUT;

  const [state, updateState] = useImmer<StateType>({
    ...initialState,
    collapse,
  });
  return [state, updateState];
};

export default useModel;
