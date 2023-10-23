import { IGraph } from '@antv/g6';

export default (graph: IGraph) => {
  Object.assign(graph, {
    findAllByState: (itemType, state) => {
      return graph.findIdByState(itemType, state).map(id => {
        const { graphCore } = graph.dataController;
        const itemMap = graphCore[`${itemType}Map`];
        return {
          ...itemMap.get(id),
          getNeighbors: () => {
            return graphCore.getNeighbors(id);
          },
          getModel: () => itemMap.get(id),
          getEdges: () => graphCore.bothEdgesMap.get(id),
        };
      });
    },
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
      return graph.getItemById(id);
    },
  });
  return graph;
};
