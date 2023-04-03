import { Graph, Item } from '@antv/g6';
import type { GraphinData } from '@antv/graphin';
import { ext } from '@antv/matrix-util';
import { isNumber } from 'lodash';

const transform = ext.transform;

const scaleNodes = (graphData: GraphinData, value: number = 600) => {
  const { nodes = [], edges = [] } = graphData;
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

/**
 * 将图上下平移，y 坐标聚焦到画布中心
 * @param graph 图实例
 * @param focusNode 需要聚焦的节点 item
 * @param height 图的高度
 */
export const focusNodeY = (graph, focusNode, height, focusTo: 'center' | 'top' | number = 'center') => {
  const y = focusNode.getModel().y;

  const group = graph.getGroup();
  let matrix = group.getMatrix() || [1, 0, 0, 0, 1, 0, 0, 0, 1];

  let vy = 0;
  if (focusTo === 'top') {
    vy = -y;
  } else if (isNumber(focusTo)) {
    const focusY = graph.getPointByCanvas(0, focusTo).y;
    vy = focusY - y;
  } else {
    // center
    const centerY = graph.getPointByCanvas(0, height / 3).y;
    vy = centerY - y;
  }
  const dy = vy * matrix[4];
  let lastY = 0;
  let newY = 0;
  group.animate(
    ratio => {
      newY = dy * ratio;
      matrix = transform(matrix, [['t', 0, newY - lastY]]);
      lastY = newY;
      return { matrix };
    },
    {
      duration: 500,
    },
  );
};

export const ADD_EDGE_ID = 'ADD_EDGE_ID';
export const addEdge = (sourceId: string, graph: Graph) => {
  const source = graph.findById(sourceId);
  const hasAddEdge = graph.findById(ADD_EDGE_ID);
  // 过滤已有添加边的情况
  if (!source || hasAddEdge) {
    return;
  }
  const { centerX, centerY, width } = source.getBBox() as any;
  const initTargetPoint = { x: centerX + width / 2 + 25, y: centerY };
  // 使用 CubicEdge 方便表示直线和临时自环
  const edgeModel = {
    id: ADD_EDGE_ID,
    zIndex: -1,
    source: sourceId,
    target: initTargetPoint,
    type: 'quadratic',
    curveLevel: 0,
    style: {
      lineAppendWidth: 30,
      endArrow: true,
    },
  };
  const edge = graph.addItem('edge', edgeModel);
  //@ts-ignore
  edge.toFront();
  source.toFront();
};

const exportGraphData = (data, fileName = 'graph-data') => {
  if (!data || typeof data !== 'object') {
    return;
  }
  const jsonText = JSON.stringify(data);
  const link = document.createElement('a');
  link.download = fileName.includes('.json') ? fileName : `${fileName}.json`;
  const jsonData = new Blob([jsonText], { type: 'text/json' });
  link.href = URL.createObjectURL(jsonData);
  link.click();
  return jsonText;
};

export function clearItemStates(graph: Graph, graphItem: Item, states: string[]) {
  states.forEach(state => {
    if (graphItem?.hasState(state)) {
      graph.setItemState(graphItem, state, false);
      graphItem.refresh();
    }
  });
}

export const clearItemsStates = (graph: Graph, items: Item[], clearStates: string[]) => {
  items.forEach(graphItem => {
    try {
      clearItemStates(graph, graphItem, clearStates);
    } catch (error) {
      console.log('error :>> ', graphItem, error);
    }
  });
};

export default {
  scaleNodes,
  focusNodeY,
  addEdge,
  exportGraphData,
  clearItemsStates,
  clearItemStates,
} as any;
