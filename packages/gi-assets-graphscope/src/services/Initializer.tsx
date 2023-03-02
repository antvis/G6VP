import { GraphSchemaData } from '@antv/gi-sdk';
import request from 'umi-request';

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
  name: '初始化查询',
  service: async (): Promise<GraphData> => {
    return {
      nodes: [],
      edges: [],
    };
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  method: 'GET',

  service: async (): Promise<GraphSchemaData> => {
    const searchParams = new URLSearchParams(location.href.split('?')[1]);
    const datasetId = searchParams.get('datasetId');

    // const graphName = localStorage.getItem('graphScopeGraphName') as string;
    // const httpServerURL = localStorage.getItem('GRAPHSCOPE_HTTP_SERVER');
    // const result = await request(`${httpServerURL}/graphcompute/schema`, {
    //   method: 'GET',
    //   params: {
    //     graphName,
    //   },
    // });
    const result = await request(`${location.hostname}:7001/project/${datasetId}`);
    if (result.success) {
      return result.data;
    }
    return {
      nodes: [],
      edges: [],
    };
  },
};
