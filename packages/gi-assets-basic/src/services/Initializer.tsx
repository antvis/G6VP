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
export interface GraphSchemaData {
  nodes: {
    nodeType: string;
    nodeTypeKeyFromProperties: string;
    properties: {
      [key: string]: any;
    };
  }[];
  edges: {
    edgeType: string;
    edgeTypeKeyFromProperties: string;
    properties: {
      [key: string]: any;
    };
  }[];
}
export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  method: 'GET',
  req: ``,
  res: `
  {
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
  `,
  service: async (): Promise<GraphData> => {
    // Server 给的上下文
    const context = localStorage.getItem('GI_SERVER_CONTEXT');
    console.log('context', context);

    // 对于GI平台，是这样取得projectId的
    const hash = window.location.hash;
    const projectId = hash.split('/')[2].split('?')[0];
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const { type } = project;

    if (type === 'project' || type === 'case') {
      return project.data.transData;
    }
    if (type === 'save') {
      const res = JSON.parse(project.params);
      return res.data;
    }
    return {
      nodes: [],
      edges: [],
    };
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  method: 'GET',
  req: ``,
  res: `
  {
    nodes: {
      nodeType: string;
      nodeTypeKeyFromProperties: string;
      properties: {
        [key: string]: any;
      };
    }[];
    edges: {
      edgeType: string;
      edgeTypeKeyFromProperties: string;
      properties: {
        [key: string]: any;
      };
    }[];
  }
`,
  service: async (): Promise<GraphSchemaData> => {
    // 对于GI平台，是这样取得projectId的
    const hash = window.location.hash;
    const projectId = hash.split('/')[2].split('?')[0];
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const { type } = project;
    if (type === 'project' || type === 'case') {
      return project.schemaData;
    }
    if (type === 'save') {
      const res = JSON.parse(project.params);
      console.log('res', res);
      return res.schemaData;
    }
    return {
      nodes: [],
      edges: [],
    };
  },
};
