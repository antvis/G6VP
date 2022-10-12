import { IEdge, INode } from '@antv/g6';
export const highlightBySelectedNodes = (selectedNodes: Set<any>, context) => {
  const { updateContext, largeGraphData, data: graphData, graph } = context;
  if (largeGraphData) {
    const nodes = largeGraphData.nodes.filter(n => selectedNodes.has(n.id));
    const edges = largeGraphData.edges.filter(e => selectedNodes.has(e.target) && selectedNodes.has(e.source));
    const newData = {
      nodes,
      edges,
    };
    updateContext(draft => {
      draft.data = newData;
      draft.source = newData;
    });
  } else {
    graphData.nodes.forEach(nodeConfig => {
      const { id } = nodeConfig;
      const item = graph.findById(id) as INode;
      if (selectedNodes.has(id)) {
        item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
        !item.hasState('selected') && graph.setItemState(id, 'selected', true);
      } else {
        !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
        item.hasState('selected') && graph.setItemState(id, 'selected', false);
      }
    });
    graphData.edges.forEach(edgeConfig => {
      const { id, source, target } = edgeConfig;
      graph.setItemState(id, 'disabled', true);
      const item = graph.findById(id) as IEdge;
      if (selectedNodes.has(target) && selectedNodes.has(source)) {
        // 两端节点都高亮时，对应的边也高亮
        !item.hasState('selected') && graph.setItemState(id, 'selected', true);
        item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
      } else {
        !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
        item.hasState('selected') && graph.setItemState(id, 'selected', false);
      }
    });
  }
};

export const highlightBySelectedEdges = (selectedEdges: Set<any>, context) => {
  const { updateContext, largeGraphData, data: graphData, graph } = context;

  const relatedNodes = new Set<string>();

  if (largeGraphData) {
    const edges = largeGraphData.edges.filter(e => {
      if (selectedEdges.has(e.id)) {
        relatedNodes.add(e.target);
        relatedNodes.add(e.source);
        return true;
      }
      return false;
    });
    const nodes = largeGraphData.nodes.filter(n => relatedNodes.has(n.id));
    const newData = {
      nodes,
      edges,
    };
    updateContext(draft => {
      draft.source = newData;
      draft.data = newData;
    });
  } else {
    graphData.edges.forEach(edgeConfig => {
      const { id } = edgeConfig;
      const item = graph.findById(id) as IEdge;

      if (selectedEdges.has(id)) {
        item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
        !item.hasState('selected') && graph.setItemState(id, 'selected', true);
        relatedNodes.add(edgeConfig.target);
        relatedNodes.add(edgeConfig.source);
      } else {
        !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
        item.hasState('selected') && graph.setItemState(id, 'selected', false);
      }
    });

    graphData.nodes.forEach(nodeConfig => {
      const { id } = nodeConfig;
      const item = graph.findById(id) as INode;
      //graph.setItemState(id, 'disabled', true);
      if (relatedNodes.has(id)) {
        // 与高亮节点相连的边也要高亮
        item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
        !item.hasState('selected') && graph.setItemState(id, 'selected', true);
      } else {
        !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
        item.hasState('selected') && graph.setItemState(id, 'selected', false);
      }
    });
  }
};
