import { IGraph } from '@antv/g6';

export default (graph: IGraph) => {
  Object.assign(graph, {
    save: () => {
      return {
        nodes: graph.getAllNodesData(),
        edges: graph.getAllEdgesData(),
        combos: graph.getAllCombosData(),
      };
    },
    getWidth: () => {
      return graph.getSize()[0];
    },
    getHeight: () => {
      return graph.getSize()[1];
    },
    changeSize: size => {
      graph.setSize(size);
    },
    toDataURL: () => {
      return true;
    },
    setAutoPaint: paint => {
      return true;
    },
    paint: () => {},
    getNodes: () => {
      return graph.getAllNodesData();
    },
    getEdges: () => {
      return graph.getAllEdgesData();
    },
    clearItemStates: node => {
      const isString = typeof node === 'string';
      if (isString) {
        graph.clearItemState([node]);
      } else {
        graph.clearItemState([node.id]);
      }
    },
    findById: id => {
      graph.getNodeData(id);
    },
  });
  return graph;
};
