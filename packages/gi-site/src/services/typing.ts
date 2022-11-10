import type { GIConfig, GraphSchemaData } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import { IActiveAssetsKeys } from '../pages/Analysis/typing';

export interface IProject {
  /** 引擎ID */
  engineId: string;
  /** 引擎的上下文，用于服务接口的额外参数 */
  engineContext: Record<string, any>;
  activeAssetsKeys: IActiveAssetsKeys;
  data: {
    transFunc?: string;
    transData: GraphinData;
    inputData: any[];
  };
  type?: 'case' | 'project' | 'save';
  id?: string;
  name?: string;
  cover?: string;
  description?: string;
  members?: { name: string; id: string; state: 'master' | 'user' }[];
  projectConfig?: GIConfig;
  serviceConfig: {
    content: string;
    id: string;
    mode: 'MOCK' | 'API';
    name: string;
  }[];
  status?: number;
  tag?: string;
  gmtCreate?: any;
  schemaData: GraphSchemaData;
  config?: GIConfig;
  themes?: any[];
}
