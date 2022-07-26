import React from 'react';
import { S2DataConfig } from '@antv/s2';

const useEdgeDataCfg = (schemaData, graphData, largeGraphData) => {
  const edgeDataCfg: S2DataConfig = React.useMemo(() => {
    const edgeProperties = schemaData.edges.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});

    let columns: string[] = [];
    for (let key in edgeProperties) {
      if (typeof edgeProperties[key] === 'number' || typeof edgeProperties[key] === 'string') {
        columns.push(key);
      }
    }
    //const data = graphData.edges.map(edge => ({ ...edge.data, id: edge.id }));
    let data;
    if (largeGraphData) {
      data = largeGraphData.edges.map(edge => ({ ...edge.data, id: edge.id }));
    } else {
      data = graphData.edges.map(edge => ({ ...edge.data, id: edge.id }));
    }

    return {
      fields: {
        columns,
      },
      data,
    };
  }, [schemaData, graphData, largeGraphData]);

  return edgeDataCfg;
};

export default useEdgeDataCfg;
