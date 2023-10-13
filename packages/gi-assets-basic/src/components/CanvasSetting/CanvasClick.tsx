import { IGraph, useContext } from '@antv/gi-sdk';

import React from 'react';
/**
 * 清除所有的样式
 * @param graph G6的Graph实例
 * @type Graph
 */
export const clearAllStates = (graph: IGraph) => {
  graph.getNodes().forEach(function (node) {
    graph.clearItemStates(node);
  });
  graph.getEdges().forEach(function (edge) {
    graph.clearItemStates(edge);
  });
};

/**
 *
 * @returns 点击Canvas的交互逻辑
 */
const CanvasClick = () => {
  const { graph } = useContext();

  React.useEffect(() => {
    const handleClear = () => {
      clearAllStates(graph);
    };
    graph.on('canvas:click', handleClear);
    return () => {
      graph.off('canvas:click', handleClear);
    };
  }, [graph]);
  return null;
};

export default CanvasClick;
