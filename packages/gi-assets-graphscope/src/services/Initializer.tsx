import { GraphSchemaData } from '@antv/gi-sdk';
import $i18n from '../i18n';

export interface GraphData {
  nodes: {
    id: string;
    nodeType: string;
    data: {};
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    edgeType: string;
    data: {};
  }[];
}

export const GI_SERVICE_INTIAL_GRAPH = {
  name: $i18n.get({ id: 'graphscope.src.services.Initializer.InitializeAQuery', dm: '初始化查询' }),
  service: async (): Promise<GraphData> => {
    try {
      //@ts-ignore
      const { LOCAL_DATA_FOR_GI_ENGINE } = window;
      return LOCAL_DATA_FOR_GI_ENGINE.data;
    } catch (error) {
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};

export const GI_SERVICE_SCHEMA = {
  name: $i18n.get({ id: 'graphscope.src.services.Initializer.QueryGraphModel', dm: '查询图模型' }),
  method: 'GET',

  service: async (): Promise<GraphSchemaData> => {
    try {
      //@ts-ignore
      const { LOCAL_DATA_FOR_GI_ENGINE } = window;
      return LOCAL_DATA_FOR_GI_ENGINE.schemaData;
    } catch (error) {
      return {
        nodes: [],
        edges: [],
      };
    }
  },
};
