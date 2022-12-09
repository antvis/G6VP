import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;

    const httpServerURL = JSON.parse(localStorage.getItem('SERVER_ENGINE_CONTEXT')!).httpServerURL
    
    const response = await request(`${httpServerURL}/api/neo4j/neighbors`, {
      method: 'post',
      data: {
        ids,
        sep,
      },
    });

    return response.data;
  },
};
