import { Graph, GraphinData } from '@antv/graphin';
export const highlightSubGraph = (graph: Graph, data: GraphinData) => {
  const source = graph.save() as GraphinData;

  const nodeIds = data.nodes.map(node => node.id);
  const edgeIds: string[] = [];
  /** 需要考虑聚合边的情况，需要构造全量的边 */
  data.edges.forEach(edge => {
    const { aggregate } = edge;
    if (aggregate) {
      aggregate.forEach(item => {
        edgeIds.push(item.id);
      });
    } else {
      edgeIds.push(edge.id);
    }
  });

  const sourceNodesCount = source.nodes.length;
  const sourceEdgesCount = edgeIds.length; //考虑聚合边
  const nodesCount = data.nodes.length;
  const edgesCount = data.edges.length;
  const isEmpty = nodesCount === 0 && edgesCount === 0;
  const isFull = nodesCount === sourceNodesCount && edgesCount === sourceEdgesCount;
  // 如果是空或者全部图数据，则恢复到画布原始状态，取消高亮
  if (isEmpty || isFull) {
    source.nodes.forEach(function (node) {
      graph.clearItemStates(node.id);
    });
    source.edges.forEach(function (edge) {
      graph.clearItemStates(edge.id);
    });
    return { isEmpty, isFull };
  }

  source.nodes.forEach(node => {
    const hasMatch = nodeIds.includes(node.id);
    if (hasMatch) {
      graph.setItemState(node.id, 'disabled', false);
      graph.setItemState(node.id, 'selected', true);
    } else {
      graph.setItemState(node.id, 'selected', false);
      graph.setItemState(node.id, 'disabled', true);
    }
  });
  source.edges.forEach(edge => {
    const { aggregate, id } = edge;

    let hasMatch = false;
    /** 考虑聚合边的情况，aggregate 数据中的 edgeId 匹配上一个就可以高亮整个聚合边 */
    if (aggregate) {
      hasMatch = aggregate
        .map(e => e.id)
        .some(itemId => {
          return edgeIds.includes(itemId);
        });
    } else {
      hasMatch = edgeIds.includes(id);
    }

    if (hasMatch) {
      console.log('match edge', edge);
      graph.setItemState(edge.id, 'disabled', false);
      graph.setItemState(edge.id, 'selected', true);
    } else {
      graph.setItemState(edge.id, 'selected', false);
      graph.setItemState(edge.id, 'disabled', true);
    }
  });
  return {
    isEmpty,
    isFull,
  };
};
/**
 *
 * @param graph Graph
 * @param edges string[]
 * @returns
 */
export const highlightEdgeIds = (graph: Graph, edgeIds: string[]) => {
  const source = graph.save() as GraphinData;

  const isEmpty = edgeIds.length === 0;

  // 如果是空或者全部图数据，则恢复到画布原始状态，取消高亮
  if (isEmpty) {
    source.edges.forEach(function (edge) {
      graph.clearItemStates(edge.id);
    });
    return { isEmpty };
  }

  source.edges.forEach(edge => {
    const { aggregate, id, source, target } = edge;
    let hasMatch = false;
    /** 考虑聚合边的情况，aggregate 数据中的 edgeId 匹配上一个就可以高亮整个聚合边 */
    if (aggregate) {
      hasMatch = aggregate
        .map(e => e.id)
        .some(itemId => {
          return edgeIds.includes(itemId);
        });
    } else {
      hasMatch = edgeIds.includes(id);
    }

    if (hasMatch) {
      graph.setItemState(id, 'disabled', false);
      graph.setItemState(id, 'selected', true);
      graph.setItemState(source, 'selected', true);
      graph.setItemState(target, 'selected', true);
      graph.updateItem(id, {
        style: {
          animate: {
            visible: true,
            type: 'circle-running',
            color: 'rgba(236,65,198,1)',
            repeat: true,
            duration: 1000,
          },
        },
      });
    } else {
      graph.setItemState(id, 'selected', false);
      graph.setItemState(id, 'disabled', true);
      graph.setItemState(source, 'disable', true);
      graph.setItemState(target, 'disable', true);
      graph.setItemState(source, 'selected', false);
      graph.setItemState(target, 'selected', false);
      graph.updateItem(id, {
        style: {
          animate: {
            visible: false,
            type: 'circle-running',
            color: 'rgba(236,65,198,1)',
            repeat: true,
            duration: 1000,
          },
        },
      });
    }
  });
  return {
    isEmpty,
  };
};
