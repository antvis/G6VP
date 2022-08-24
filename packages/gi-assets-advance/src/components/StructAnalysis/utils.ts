// 映射路径的 key 值
export const getPathKey = (nodePath: string[], edgePath: string[], sourceDataMap): string => {
  let res = '';
  const nodeMap = sourceDataMap.nodes;
  const edgeMap = sourceDataMap.edges;
  for (let i = 0; i < nodePath.length - 1; i++) {
    const nodeId = nodePath[i];
    const edgeId = edgePath[i];
    res = res + nodeMap[nodeId].nodeType + '->' + edgeMap[edgeId].edgeType + '->';
  }
  const lastNodeId = nodePath[nodePath.length - 1];
  res = res + nodeMap[lastNodeId].nodeType;
  return res;
};
