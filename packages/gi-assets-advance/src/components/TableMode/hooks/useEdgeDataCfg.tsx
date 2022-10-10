import { useContext } from '@alipay/graphinsight';
import { S2DataConfig } from '@antv/s2';
import React from 'react';

// 生成边表的数据
const useEdgeDataCfg = (): S2DataConfig => {
  const { schemaData, source: graphData, largeGraphData } = useContext();
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

    /* 
      在大图模式下，表格的数据源为 largeGraphData
      此时刷选和点选表格时会过滤画布数据
    */
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
