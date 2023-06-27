import $i18n from '../i18n';
export const NeighborsQuery = {
  name: $i18n.get({ id: 'janusgraph.src.services.NeighborsQuery.NeighborQuery', dm: '邻居查询' }),
  service: async params => {
    const { ids, sep } = params;
    return {};
  },
};
