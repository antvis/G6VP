import React from 'react';
import { useContext } from '@alipay/graphinsight';
import { S2DataConfig } from '@antv/s2';
const useNodeDataCfg = (): S2DataConfig => {
  const { schemaData, data: graphData, largeGraphData } = useContext();

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
    //const data = graphData.nodes.map(node => ({ ...node.data, id: node.id }));
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
