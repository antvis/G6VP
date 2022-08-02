import type { GraphSchemaData, GIConfig } from '@alipay/graphinsight';
import { GraphinData } from '@antv/graphin';
import { IActiveAssetsKeys } from '../pages/Analysis/typing';

export interface IProject {
  activeAssetsKeys: IActiveAssetsKeys;
  data: {
    transFunc?: string;
    transData: GraphinData;
    inputData: any[]
  };
  type?: 'case' | 'project' | 'save';
  id?: string;
  name?: string
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
}
