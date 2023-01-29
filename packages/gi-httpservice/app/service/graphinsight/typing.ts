import { GIConfig, GraphSchemaData } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';

export interface IActiveAssetsKeys {
  components: string[];
  elements: string[];
  layouts: string[];
}

export interface IProject {
  /** 引擎ID */
  engineId: string;
  /** 引擎的上下文，用于服务接口的额外参数 */
  engineContext: Record<string, any>;
  /** 项目激活的资产ID */
  activeAssetsKeys: IActiveAssetsKeys;
  /** 项目数据 */
  data: {
    transFunc?: string;
    transData: GraphinData;
    inputData: any[];
  };
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
  schemaData: GraphSchemaData;
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

