import { useMemo } from 'react';
const useSourceDataMap = source => {
  return useMemo(() => {
    const nodes = source.nodes.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    const edges = source.edges.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    return {
      nodes,
      edges,
    };
  }, [source]);
};
export default useSourceDataMap;
