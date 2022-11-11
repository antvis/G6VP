import request from 'umi-request';
export const NeighborsQuery = {
  name: '邻居查询',
  service: async params => {
    const { ids, sep } = params;

    const httpServerURL = localStorage.getItem('Neo4j_HTTP_SERVER');

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
