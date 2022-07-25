export const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  reqParams: [],
  resParams: {},
  service: async () => {
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
  },
};

export const GI_SERVICE_SCHEMA = {
  name: '查询图模型',
  service: async () => {
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
  },
};
