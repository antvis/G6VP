import { Graph } from '@antv/graphin';

/**
 *
 * @param graph G6的Graph实例
 * @returns (nodeIds:string[])=>void
 */
export const highlightNodeById = (graph: Graph) => (nodeIds: string[]) => {
  graph.getNodes().forEach(node => {
    graph.clearItemStates(node, ['selected', 'inactive']);
    if (nodeIds.indexOf(node.get('id')) !== -1) {
      graph.setItemState(node, 'selected', true);
      graph.setItemState(node, 'inactive', false);
    } else {
      graph.setItemState(node, 'selected', false);
      graph.setItemState(node, 'inactive', true);
    }
  });

  graph.getEdges().forEach(edge => {
    graph.clearItemStates(edge, ['selected', 'inactive']);
    const { source, target } = edge.getModel() as {
      source: string;
      target: string;
    };

    if (nodeIds.indexOf(source) !== -1 && nodeIds.indexOf(target) !== -1) {
      graph.setItemState(edge, 'selected', true);
      graph.setItemState(edge, 'inactive', false);
    } else {
      graph.setItemState(edge, 'selected', false);
      graph.setItemState(edge, 'inactive', true);
    }
  });
};

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
 * @param node 获取节点的一度上游节点
 * @param filter 上游节点的过滤条件，类似Array.filter方法，返回为false的会被过滤，默认为true，即不过滤任何上游节点
 * @type (node:G6.INode,filter:(source?: any) => boolean)
 * @returns nodes 返回上游节点的集合
 * @type [G6.INode]
 */
export const getSourcesByNode = (node: any, filter: (source?: any) => boolean = () => true) => {
  const nodes = node
    .getEdges()
    .map((edge: any) => {
      const source = edge.getSource().getModel();

      const isFilter = filter(source); /** 是否过滤数据 */
      if (isFilter && source.id !== node.getModel().id) {
        return edge.getSource();
      }
      return null;
    })
    .filter((node: any) => {
      return node !== null;
    });
  return nodes;
};

/**
 *
 * @param node 获取节点的一度下游节点
 * @param filter 下游节点的过滤条件，类似Array.filter方法，返回为false的会被过滤，默认为true，即不过滤即任何下游节点
 * @type (node:G6.INode,filter:(target?: any) => boolean)
 * @type G6.INode
 * @returns nodes 返回的下游游节点结合
 * @type [G6.INode]
 */
export const getTargetsByNode = (node: any, filter: (source?: any) => boolean = () => true) => {
  const nodes = node
    .getEdges()
    .map((edge: any) => {
      const target = edge.getTarget().getModel();
      const isFilter = filter(target); /** 是否过滤数据 */
      if (isFilter && target.id !== node.getModel().id) {
        return edge.getTarget();
      }
      return null;
    })
    .filter((node: any) => {
      return node !== null;
    });
  return nodes;
};

/**
 * 根据输入的节点，递归遍历所有的下游节点集合
 * @returns node[]
 */
export const traverseTargetsByNode = (root: any) => {
  let result: any[] = [];
  const walk = (nodes: any) => {
    nodes.forEach((node: any) => {
      const nodes = getTargetsByNode(node, target => {
        return target.data.type === 'ENTITY';
      });
      result = [...result, ...nodes];
      if (nodes.length !== 0) {
        walk(nodes);
      }
    });
  };
  walk([root]);
  return result;
};

/**
 * 根据输入的节点，递归遍历所有的上游节点集合
 * @returns node[]
 */
export const traverseSourcesByNode = (root: any) => {
  let result: any[] = [];
  const walk = (nodes: any) => {
    nodes.forEach((node: any) => {
      const nodes = getSourcesByNode(node, target => {
        return target.data.type === 'ENTITY';
      });
      result = [...result, ...nodes];
      if (nodes.length !== 0) {
        walk(nodes);
      }
    });
  };
  walk([root]);
  return result;
};

/** 数组去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);
