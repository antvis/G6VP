import { IEdge, INode } from '@antv/g6';

export const getPositionStyles = (placement, offset: number[]) => {
  const styles: { [key: string]: string } = {
    position: 'absolute',
    top: 'unset',
    left: 'unset',
    right: 'unset',
    bottom: 'unset',

    //
  };
  const [offsetX, offsetY] = offset;
  if (placement === 'RT') {
    styles.right = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LT') {
    styles.left = `${offsetX}px`;
    styles.top = `${offsetY}px`;
  }
  if (placement === 'LB') {
    styles.left = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  if (placement === 'RB') {
    styles.right = `${offsetX}px`;
    styles.bottom = `${offsetY}px`;
  }
  return styles;
};

/** 数据去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

/**
 *
 * @param data 画布中的图数据
 * @param responseData 扩展出来的图数据
 * @returns
 */
export const handleExpand = (data, responseData) => {
  const { nodes, edges } = responseData;
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      return a.source === b.source && a.target === b.target;
    }),
  };
};

/**
 *
 * @param data 画布中的图数据
 * @param responseData 需要收起的图数据
 * @returns
 */
export const handleCollaspe = (data, responseData) => {
  const nodeIds = responseData.nodes.map(c => c.id);
  const edgeIds = responseData.edges.map(c => `${c.source}-${c.target}`);
  const nodes = data.nodes.filter(c => {
    return nodeIds.indexOf(c.id) === -1;
  });
  const edges = data.edges.filter(c => {
    const id = `${c.source}-${c.target}`;
    return edgeIds.indexOf(id) === -1;
  });
  console.log(nodes, edges);

  return {
    nodes,
    edges,
  };
};

/**
 *
 * @param services 从上下文得到的 services
 * @param serviceId 组件绑定的 serviceId
 * @returns
 */
export const getService = (services: any[], serviceId?: string) => {
  if (!serviceId) {
    console.warn('not found serviceId', serviceId);
    return null;
  }
  const { service } = services.find(s => s.id === serviceId);
  if (!service) {
    console.warn('Component need a service', serviceId);
    return null;
  }
  return service;
};

/**
 *
 * @param graphData 画布中的图数据
 * @param ids 需要b被过滤的节点 id
 * @returns
 */
export const filterGraphDataByNodes = (graphData, ids: string[]) => {
  const { edges, nodes } = graphData;
  //const ids = targetNodes.map(node => node.getModel().id);
  const newEdges = edges.filter(edge => {
    const { source, target } = edge;
    if (ids.indexOf(source) !== -1 || ids.indexOf(target) !== -1) {
      return false;
    }
    return true;
  });
  const newNodes = nodes.filter(node => {
    return ids.indexOf(node.id) === -1;
  });
  return {
    nodes: newNodes,
    edges: newEdges,
  };
};

/**
 * 获取边上的另一节点
 */
export const getEdgeOtherNode = (edge: IEdge, node: INode) => {
  if (edge.getSource().getModel().id === edge.getTarget().getModel().id) return;
  const edgeModel = edge.getModel();
  return edgeModel.source === node.getModel().id ? edge.getTarget() : edge.getSource();
};

/**
 * 获取某一个节点的直接关联节点
 */
export const getUniRelativeNodes = (node: INode) => {
  const relativeEdges = node.getEdges();
  const relativeNodes = new Set() as Set<INode>;
  relativeEdges.forEach(edge => {
    const relativeNode = getEdgeOtherNode(edge, node);
    if (relativeNode) {
      relativeNodes.add(relativeNode);
    }
  });
  return Array.from(relativeNodes);
};

/**
 * 获得可以收起的节点
 */
export const getLeafNodes = (node: INode) => {
  const relativeEdges = node.getEdges();
  const relativeNodes = new Set() as Set<INode>;
  relativeEdges.forEach(edge => {
    const relativeNode = getEdgeOtherNode(edge, node);
    if (relativeNode) {
      const relativeNodeChildren = getUniRelativeNodes(relativeNode);
      if (!relativeNodeChildren.find(n => n.getModel().id !== node.getModel().id)) {
        relativeNodes.add(relativeNode);
      }
    }
  });
  return Array.from(relativeNodes);
};
