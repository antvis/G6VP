const GI_SERVICE_INTIAL_GRAPH = {
  name: '初始化查询',
  service: async params => {
    // 对于GI平台，是这样取得projectId的
    const hash = window.location.hash;
    const projectId = hash.split('/')[2].split('?')[0];

    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    console.log('project', project, projectId);
  },
};
