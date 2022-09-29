import { useContext } from '@alipay/graphinsight';
import { S2DataConfig } from '@antv/s2';
import React from 'react';

// 生成点表的数据
const useNodeDataCfg = (): S2DataConfig => {
  const { schemaData, source: graphData, largeGraphData } = useContext();

  const nodeDataCfg: S2DataConfig = React.useMemo(() => {
    const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});

    let columns: string[] = [];
    for (let key in nodeProperties) {
      if (typeof nodeProperties[key] === 'number' || typeof nodeProperties[key] === 'string') {
        columns.push(key);
      }
    }

    /* 
      在大图模式下，表格的数据源为 largeGraphData
      此时刷选和点选表格时会过滤画布数据
    */
    let data;
    if (largeGraphData) {
      data = largeGraphData.nodes.map(node => ({ ...node.data, id: node.id }));
    } else {
      data = graphData.nodes.map(node => ({ ...node.data, id: node.id }));
    }

    return {
      fields: {
        columns,
      },
      data,
    };
  }, [schemaData, graphData, largeGraphData]);
  return nodeDataCfg;
};

export default useNodeDataCfg;
