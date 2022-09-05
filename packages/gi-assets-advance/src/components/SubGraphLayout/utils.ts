import { LayoutMap } from './const';
import { Graph, GraphData } from '@antv/g6';
import { ILayoutOption } from './typing';

/**
 * 根据目标节点生成子图
 * @param graphData 画布图数据
 * @param targetNodes 目标节点
 * @returns 生成的子图
 */
export const cropGraphByNodes = (graphData: GraphData, targetNodes: { id: string }[]) => {
  const { edges, nodes } = graphData;
  const ids = targetNodes.map(node => node.id);
  const newEdges = edges!.filter(edge => {
    const { source, target } = edge;
    if (ids.indexOf(source!) !== -1 && ids.indexOf(target!) !== -1) {
      return true;
    }
    return false;
  });
  const newNodes = nodes!.filter(node => {
    return ids.indexOf(node.id) !== -1;
  }).map(node => {
    // 映射节点大小，用于圆形布局防重叠：https://github.com/antvis/layout/blob/master/src/layout/circular.ts#L213
    node.size = node.style?.keyshape.size || 26;
    /* 
        注意：这里不能使用 return {...node, size: node.style?.keyshape.size || 26}，
        因为我们需要将原来的那批节点返回，进行布局转化
    */
    return node;
  });
  return {
    nodes: newNodes,
    edges: newEdges,
  };
};

/**
 * 更新布局
 * @param layouts 布局信息
 * @param graph G6 graph 实例
 * @param gap 子图之间的间隙
 * @returns 
 */
export const updateLayout = (
  layouts: ILayoutOption[],
  graph: Graph,
  gap: number,
  direction: 'vertical' | 'horizontal',
) => {
  const count = layouts.length;
  const source = graph.save();

  const width = graph.get('width') / count;
  const height = graph.get('height') / count;

  layouts
    //过滤掉节点为空的布局
    .filter(lay => {
      return lay.nodes.length !== 0;
    })
    .forEach((layout, index) => {
      const { type, options, nodes } = layout;

      let center: [number, number];
      if (direction === 'horizontal') {
        center = [gap / 2 + index * gap, height / 2];
      } else {
        center = [width / 2, gap + index * gap];
      }

      const layoutOptions = {
        width,
        height,
        center,
        ...options,
      };
      const instance = new LayoutMap[type](layoutOptions);
      const newGraphData = cropGraphByNodes(source, nodes);
      instance.layout(newGraphData);
    });

  graph.positionsAnimate();
};