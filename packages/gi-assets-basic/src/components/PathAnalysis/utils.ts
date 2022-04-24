import type { Graph } from '@antv/g6';
import type { IUserEdge, GraphinData } from '@antv/graphin';
export const getEdgeIdMap = (edges: IUserEdge[]) => {
  const edgeIdMap = new Map<string, string[]>();
  edges.forEach(edge => {
    const idx = `${edge.source}-${edge.target}`;
    edgeIdMap.has(idx) ? edgeIdMap.set(idx, [...edgeIdMap.get(idx)!, edge.id]) : edgeIdMap.set(idx, [edge.id]);
  });
  return edgeIdMap;
};

type IVisitedNode = {
  node: string;
  edge: string;
};

export const findAllPath = (graphData: GraphinData, start: string, end: string, directed?: boolean) => {
  if (start === end) {
    const edges = graphData.edges.filter(edge => edge.source === start && edge.target === end);
    const allNodePath = new Array(edges.length).fill([start]);
    const allEdgePath = edges.map(edge => [edge.id]);
    return {
      allNodePath,
      allEdgePath,
    };
  }

  const { edges = [] } = graphData;

  const visited = [start];
  // 与节点绑定的边
  const edgePath: string[] = [];
  const isVisited = { [start]: true };
  const stack: IVisitedNode[][] = []; // 辅助栈，用于存储访问过的节点的邻居节点
  const allPath: string[][] = [];
  const allEdgePath: string[][] = [];
  let neighbors = directed ? getNeighbors(start, edges, 'target') : getNeighbors(start, edges);
  stack.push(neighbors);

  while (visited.length > 0 && stack.length > 0) {
    const children = stack[stack.length - 1];
    if (children.length) {
      const child = children.shift();
      if (child) {
        visited.push(child.node);
        edgePath.push(child.edge);
        isVisited[child.node] = true;
        neighbors = directed ? getNeighbors(child.node, edges, 'target') : getNeighbors(child.node, edges);
        stack.push(neighbors.filter(neighbor => !isVisited[neighbor.node]));
      }
    } else {
      const node = visited.pop() as string;
      edgePath.pop();
      isVisited[node] = false;
      stack.pop();
      continue;
    }

    if (visited[visited.length - 1] === end) {
      const path = visited.map(node => node);
      allPath.push(path);
      allEdgePath.push([...edgePath]);

      const node = visited.pop() as string;
      edgePath.pop();
      isVisited[node] = false;
      stack.pop();
    }
  }

  return { allNodePath: allPath, allEdgePath };
};

export const getNeighbors = (
  nodeId: string,
  edges: IUserEdge[] = [],
  type?: 'target' | 'source' | undefined,
): IVisitedNode[] => {
  const currentEdges = edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
  if (type === 'target') {
    // 当前节点为 source，它所指向的目标节点
    const neighhborsConverter = (edge: IUserEdge) => {
      return edge.source === nodeId;
    };
    return currentEdges.filter(neighhborsConverter).map(edge => ({ node: edge.target, edge: edge.id }));
  }
  if (type === 'source') {
    // 当前节点为 target，它所指向的源节点
    const neighhborsConverter = (edge: IUserEdge) => {
      return edge.target === nodeId;
    };
    return currentEdges.filter(neighhborsConverter).map(edge => ({ node: edge.source, edge: edge.id }));
  }

  // 若未指定 type ，则返回所有邻居
  const neighhborsConverter = (edge: IUserEdge) => {
    return edge.source === nodeId ? { node: edge.target, edge: edge.id } : { node: edge.source, edge: edge.id };
  };
  return currentEdges.map(neighhborsConverter);
};


/**
 *
 * @param path 由边构成的路径
 * @param  weightPropertyName 权重
 * @param graphData 图数据
 * @return 路径长度
 */

export const getPathByWeight = (path: string[], weightPropertyName: string, graphData: GraphinData) => {
  let pathLen: number = 0;
  path.forEach(edgeId => {
    const edgeConfig = graphData.edges.find(edge => edge.id === edgeId)!;
    const data = edgeConfig.data;
    pathLen = pathLen + data[weightPropertyName] ? data[weightPropertyName] : 0;
  });
  console.log(pathLen, '@pathLen');
  return pathLen;
};
