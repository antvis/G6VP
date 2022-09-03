import type { Graph, GraphinData } from "@antv/graphin";
import { IFilterCriteria } from "./type";

/**
 *
 * @param source 筛选前的画布数据
 * @param filterCriteria 筛选标准
 * @param graph G6 画布实例
 * @returns
 */
export const filterGraphData = (
  source: GraphinData,
  filterCriteria: IFilterCriteria,
  isFilterIsolatedNodes: boolean
): GraphinData => {
  const {
    analyzerType,
    isFilterReady,
    elementType,
    prop,
    selectValue,
    range,
  } = filterCriteria;
  if (!isFilterReady || analyzerType === "NONE") {
    return source;
  }

  const newData: GraphinData = {
    nodes: [],
    edges: [],
  };

  if (elementType === "node") {
    const inValidNodes = new Set<string>();
    newData.nodes = source.nodes.filter((node) => {
      if (
        analyzerType === "SELECT" ||
        analyzerType === "PIE" ||
        analyzerType === "WORDCLOUD" || 
        analyzerType === "COLUMN"
      ) {
        if (
          node.data &&
          node.data[prop!] != undefined &&
          selectValue?.indexOf(node.data[prop!]) !== -1
        ) {
          return true;
        }
        inValidNodes.add(node.id);
        return false;
      } else if (analyzerType === "HISTOGRAM") {
        // const min = range![0];
        // const max = range![1];
        // if (node.data && node.data[prop!] && min <= node.data[prop!] && node.data[prop!] <= max) {
        //   return true;
        // }
        // inValidNodes.add(node.id);
        // return false;
        for (let arr of range!) {
          const min = arr[0];
          const max = arr[1];
          if (
            node.data &&
            node.data[prop!] &&
            min <= node.data[prop!] &&
            node.data[prop!] <= max
          ) {
            return true;
          }
        }
        inValidNodes.add(node.id);
        return false;
      }
    });
    newData.edges = source.edges.filter((edge) => {
      return !inValidNodes.has(edge.source) && !inValidNodes.has(edge.target);
    });
  } else if (elementType === "edge") {
    const validNodes = new Set<string>();
    newData.edges = source.edges.filter((edge) => {
      if (
        analyzerType === "SELECT" ||
        analyzerType === "PIE" ||
        analyzerType === "WORDCLOUD"  || 
        analyzerType === "COLUMN"
      ) {
        if (
          edge.data &&
          edge.data[prop!] != undefined &&
          selectValue?.indexOf(edge.data[prop!]) !== -1
        ) {
          validNodes.add(edge.source);
          validNodes.add(edge.target);
          return true;
        }

        return false;
      } else if (analyzerType === "HISTOGRAM") {
        // const min = range![0];
        // const max = range![1];
        // if (
        //   edge.data &&
        //   edge.data[prop!] &&
        //   min <= edge.data[prop!] &&
        //   edge.data[prop!] <= max
        // ) {
        //   validNodes.add(edge.source);
        //   validNodes.add(edge.target);
        //   return true;
        // }
        // return false;
        for (let arr of range!) {
          const min = arr![0];
          const max = arr![1];
          if (
            edge.data &&
            edge.data[prop!] &&
            min <= edge.data[prop!] &&
            edge.data[prop!] <= max
          ) {
            validNodes.add(edge.source);
            validNodes.add(edge.target);
            return true;
          }
        }
        return false;
      }
    });
    newData.nodes = isFilterIsolatedNodes
      ? source.nodes.filter((node) => validNodes.has(node.id))
      : source.nodes;
  }
  return newData;
};

export const getValueMap = (
  graphData: GraphinData,
  prop: string,
  elementType: "node" | "edge"
) => {
  const elements = elementType === "node" ? graphData.nodes : graphData.edges;
  const valueMap = new Map<string, number>();
  elements?.forEach((e) => {
    e.data &&
      e.data[prop] != undefined &&
      valueMap.set(
        e.data[prop],
        valueMap.has(e.data[prop]) ? valueMap.get(e.data[prop])! + 1 : 1
      );
  });
  return valueMap;
};

export const getHistogramData = (
  graphData,
  prop: string,
  elementType: "node" | "edge"
) => {
  const elements = elementType === "node" ? graphData.nodes : graphData.edges;
  const data = elements
    .filter((e) => e.data && e.data[prop] && typeof e.data[prop] === "number")
    .map((e) => ({ value: e.data[prop] }));
  data.sort((a, b) => a.value - b.value);
  return data;
};

//@todo 感觉需要算法优化下，后面再做吧
export const highlightSubGraph = (graph, data: GraphinData) => {
  const source = graph.save() as GraphinData;

  const nodeIds = data.nodes.map((node) => node.id);
  const edgeIds = data.edges.map((edge) => edge.id);

  const sourceNodesCount = source.nodes.length;
  const sourceEdgesCount = source.edges.length;
  const nodesCount = data.nodes.length;
  const edgesCount = data.edges.length;
  const isEmpty = nodesCount === 0 && edgesCount === 0;
  const isFull =
    nodesCount === sourceNodesCount && edgesCount === sourceEdgesCount;
  // 如果是空或者全部图数据，则恢复到画布原始状态，取消高亮
  if (isEmpty || isFull) {
    source.nodes.forEach(function (node) {
      graph.clearItemStates(node.id);
    });
    source.edges.forEach(function (edge) {
      graph.clearItemStates(edge.id);
    });
    return;
  }

  source.nodes.forEach((node) => {
    const hasMatch = nodeIds.includes(node.id);
    if (hasMatch) {
      graph.setItemState(node.id, "disabled", false);
      graph.setItemState(node.id, "selected", true);
    } else {
      graph.setItemState(node.id, "selected", false);
      graph.setItemState(node.id, "disabled", true);
    }
  });
  source.edges.forEach((edge) => {
    const hasMatch = edgeIds.includes(edge.id);
    if (hasMatch) {
      graph.setItemState(edge.id, "disabled", false);
      graph.setItemState(edge.id, "selected", true);
    } else {
      graph.setItemState(edge.id, "selected", false);
      graph.setItemState(edge.id, "disabled", true);
    }
  });
};
