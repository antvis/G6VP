import { utils } from '@alipay/graphinsight';
import { GAP, LayoutMap } from './const';

const { uniqueElementsBy } = utils;

export const cropGraphByNodes = (graphData, targetNodes) => {
  const { edges, nodes } = graphData;
  const ids = targetNodes.map(node => node.id);
  const newEdges = edges.filter(edge => {
    const { source, target } = edge;
    if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
      return true;
    }
    return false;
  });
  const newNodes = nodes.filter(node => {
    return ids.indexOf(node.id) !== -1;
  });
  return {
    nodes: newNodes,
    edges: newEdges,
  };
};

export const getLayoutsByOptions = (layouts, graph) => {
  const count = layouts.length;
  const source = graph.save();

  const width = graph.get('width') / count;
  const height = graph.get('height') / count;

  const datas = layouts
    //过滤掉节点为空的布局
    .filter(lay => {
      return lay.nodes.length !== 0;
    })
    .map((layout, index) => {
      const { type, options, nodes } = layout;
      const layoutOptions = {
        width,
        height,
        center: [width / 2 + index * width + GAP, 0, height / 2],
        ...options,
      };
      console.log('COUNT:', count, 'INDEX', index, 'OPTIONS', layoutOptions);
      const instance = new LayoutMap[type](layoutOptions);
      const newGraphData = cropGraphByNodes(source, nodes);
      console.log("newGraphData:", newGraphData)
      const newModel = instance.layout(newGraphData);
      console.log("newModel:", newModel)
      return newModel;
    });
  console.log("datas:", datas)
  const newDatas = datas.reduce(
    (acc, curr) => {
      return {
        nodes: [...acc.nodes, ...curr.nodes],
        edges: [...acc.edges, ...curr.edges],
      };
    },
    {
      nodes: [],
      edges: [],
    },
  );
  const filteredDatas = {
    nodes: uniqueElementsBy(newDatas.nodes, (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy(newDatas.edges, (a, b) => {
      return a.source === b.source && a.target === b.target;
    }),
  };
  console.log('datas', datas, filteredDatas);

  // graph.refreshPositions();
  graph.positionsAnimate();
  return filteredDatas;
};
