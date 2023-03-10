import React from 'react';
import { useContext } from '@antv/gi-sdk';
import { GraphData } from '@antv/g6';
export default () => {
  const context = useContext();
  const removeNodes = React.useCallback((nodeIds: any[]) => {
    if(nodeIds.length === 0){
      return;
    }
    const graphData = context.graph.save() as GraphData;
    const nodeMap: any = {};
    const nodes = graphData.nodes?.filter((n: any) => {
      const result = !nodeIds.includes(n.id) ;
      if(result){
        nodeMap[n.id] = n;
      }
      return result;
    });
    const edges = graphData.edges?.filter((edge) => {
      return nodeMap[edge.source!] && nodeMap[edge.target!];
    });
    context.updateData({
      ...graphData,
      nodes,
      edges
    });
  },[context]);
  const removeEdges = React.useCallback((edgeIds: any[]) => {
    if(edgeIds.length === 0){
      return;
    }
    const graphData = context.graph.save() as GraphData;
    const edges = graphData.edges?.filter((edge) => {
      return !edgeIds.includes(edge.id);
    });
    context.updateData({
      ...graphData,
      edges
    });
  },[context]);
  return React.useMemo(() => {
    return {
      removeNodes,removeEdges
    }
  },[removeNodes,removeEdges]);
}