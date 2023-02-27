import type { GIConfig, GIGraphData, GraphSchemaData } from '@antv/gi-sdk';
import { IActiveAssetsKeys } from '../pages/Analysis/typing';

export interface IDataset {
  /** 数据集ID */
  id: string;
  /** 数据集类型:用户/案例/系统直连 */
  type: 'user' | 'case' | 'system';
  /** 数据集名称*/
  name?: string;
  /** 数据集的来源，用户「系统直连」展示 */
  from?: string;
  /** 引擎类型 */
  engineType: 'DB_GRAPH' | 'DB_GEO' | 'FILE_GRAPH' | 'FILE_GEO' | 'API_GRAPH' | 'API_GEO';
  /** 引擎ID */
  engineId: string;
  /** 引擎的上下文，用于服务接口的额外参数 */
  engineContext: Record<string, any>;
  /** 图模型 */
  schemaData: GraphSchemaData;
  /** 初始化图数据 */
  data?: GIGraphData;
  /** 进入回收站的时间(时间戳)，有值代表处于回收站中，数据集列表不应展示 */
  recycleTime?: number;
}

export interface ITemplate {
  /** 模版ID */
  id: string;
  /** 模版名称*/
  name?: string;
  /** 组件配置 */
  components: GIConfig['components'];
  /** 布局配置 */
  layout: GIConfig['layout'];
  /** 可用的激活资产ID */
  activeAssetsKeys: IActiveAssetsKeys;
}

export interface IProject {
  /** 数据集ID */
  datasetId: string;
  /** 项目激活的资产ID */
  activeAssetsKeys: IActiveAssetsKeys;
  /** 项目类型 */
  type?: 'case' | 'project' | 'save' | 'template';
  id?: string;
  /** 项目名称 */
  name?: string;
  cover?: string;
  description?: string;
  members?: { name: string; id: string; state: 'master' | 'user' }[];
  projectConfig?: GIConfig;
  status?: number;
  tag?: string;
  gmtCreate?: any;
  config?: GIConfig;
  themes?: any[];
}

export interface ICase extends IProject {
  id: string;
  title: string;
  tag: string;
  author: string;
  time: string;
  video: string;
  coverImg: string;
}
