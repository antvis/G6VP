import type { GraphinData } from '@antv/graphin';

const scaleNodes = (graphData: GraphinData, value: number = 600) => {
  const{ nodes = [], edges = [] } = graphData;
  if (!nodes?.length) {
    return;
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    if (node.x === undefined || node.y === undefined) {
      return;
    }
    if (node.x < minX) {
      minX = node.x;
    }
    if (node.x > maxX) {
      maxX = node.x;
    }
    if (node.y < minY) {
      minY = node.y;
    }
    if (node.y > maxY) {
      maxY = node.y;
    }
  });
  const wRatio = (maxX - minX) / value;
  const hRatio = (maxY - minY) / value;
  const ratio = Math.max(wRatio, hRatio);
  if (ratio < 1) {
    return {
      nodes,
      edges,
    };
  }
  return {
    nodes: nodes.map(node => ({
      ...node,
      x: node.x ? node.x / ratio : undefined,
      y: node.y ? node.y / ratio : undefined,
    })),
    edges,
  };
};

export default {
  scaleNodes,
};
