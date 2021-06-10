import { Graph } from '@antv/graphin';
import React from 'react';
import { GIContext } from '../index';
/**
 * 清除所有的样式
 * @param graph G6的Graph实例
 * @type Graph
 */
export const clearAllStates = (graph: Graph) => {
  graph.setAutoPaint(false);
  graph.getNodes().forEach(function (node) {
    graph.clearItemStates(node);
  });
  graph.getEdges().forEach(function (edge) {
    graph.clearItemStates(edge);
  });
  graph.paint();
  graph.setAutoPaint(true);
};

/**
 *
 * @returns 点击Canvas的交互逻辑
 */
const CanvasClick = () => {
  const { graph } = React.useContext(GIContext);

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
