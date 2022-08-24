/**
 *
 * @param path 由边构成的路径
 * @param  weightPropertyName 权重
 * @param graphData 图数据
 * @return 路径长度
 */

export const getPathByWeight = (path: string[], weightPropertyName: string, sourceDataMap) => {
  let pathLen: number = 0;
  path.forEach(edgeId => {
    const edgeConfig = sourceDataMap.edges[edgeId];
    const data = edgeConfig.data;
    pathLen = pathLen + data[weightPropertyName] ? data[weightPropertyName] : 0;
  });
  return pathLen;
};
