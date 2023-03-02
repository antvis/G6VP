import type { GIConfig, GraphSchemaData } from '@antv/gi-sdk';

export interface IActiveAssetsKeys {
  components: string[];
  elements: string[];
  layouts: string[];
}

export interface IProject {
  activeAssetsKeys: IActiveAssetsKeys;
  /** 项目类型 */
  type?: 'case' | 'project' | 'save';
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

export interface IDataset {
  id: string;
  /** 引擎ID */
  engineId: string;
  /** 引擎的上下文，用于服务接口的额外参数 */
  engineContext: Record<string, any>;
  /** 图模型 */
  schemaData: GraphSchemaData;
  /** 初始化图数据 */
  data?: any;
  gmtCreate: any;
}
