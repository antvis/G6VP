import type { GraphinData } from '@antv/graphin';
import { IFilterCriteria } from './type';

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
  isFilterIsolatedNodes: boolean,
): GraphinData => {
  const { analyzerType, isFilterReady, elementType, prop, selectValue, range } = filterCriteria;
  if (!isFilterReady || analyzerType === 'NONE') {
    return source;
  }

  const newData: GraphinData = {
    nodes: [],
    edges: [],
  };

  if (elementType === 'node') {
    const inValidNodes = new Set<string>();
    newData.nodes = source.nodes.filter(node => {
      if (analyzerType === 'SELECT' || analyzerType === 'PIE' || analyzerType === 'WORDCLOUD') {
        if (node.data && node.data[prop!] && selectValue?.indexOf(node.data[prop!]) !== -1) {
          return true;
        }
        inValidNodes.add(node.id);
        return false;
      } else if (analyzerType === 'BRUSH') {
        const min = range![0];
        const max = range![1];
        if (node.data && node.data[prop!] && min <= node.data[prop!] && node.data[prop!] <= max) {
          return true;
        }
        inValidNodes.add(node.id);
        return false;
      }
    });
    newData.edges = source.edges.filter(edge => {
      return !inValidNodes.has(edge.source) && !inValidNodes.has(edge.target);
    });
  } else if (elementType === 'edge') {
    const validNodes = new Set<string>();
    newData.edges = source.edges.filter(edge => {
      if (analyzerType === 'SELECT' || analyzerType === 'PIE' || analyzerType === 'WORDCLOUD') {
        if (edge.data && edge.data[prop!] && selectValue?.indexOf(edge.data[prop!]) !== -1) {
          validNodes.add(edge.source);
          validNodes.add(edge.target);
          return true;
        }

        return false;
      } else if (analyzerType === 'BRUSH') {
        const min = range![0];
        const max = range![1];
        if (edge.data && edge.data[prop!] && min <= edge.data[prop!] && edge.data[prop!] <= max) {
          validNodes.add(edge.source);
          validNodes.add(edge.target);
          return true;
        }
        return false;
      }
    });
    newData.nodes = isFilterIsolatedNodes ? source.nodes.filter(node => validNodes.has(node.id)) : source.nodes;
  }
  return newData;
};

export const getValueMap = (graphData: GraphinData, prop: string, elementType: 'node' | 'edge') => {
  const elements = elementType === 'node' ? graphData.nodes : graphData.edges;
  const valueMap = new Map<string, number>();
  elements?.forEach(e => {
    e.data &&
      e.data[prop] &&
      valueMap.set(e.data[prop], valueMap.has(e.data[prop]) ? valueMap.get(e.data[prop])! + 1 : 1);
  });
  return valueMap;
};

// 获取直方图相关数据
export const getHistogram = (graphData: GraphinData, prop: string, elementType: 'node' | 'edge', color: string) => {
  const elements = elementType === 'node' ? graphData.nodes : graphData.edges;
  const valueMap = new Map<number, number>();
  let maxValue = -Infinity;
  let minValue = Infinity;
  elements.forEach(e => {
    const value = e.data && e.data[prop];
    if (value && typeof value === 'number') {
      valueMap.set(value, valueMap.has(value) ? valueMap.get(value)! + 1 : 1);
      maxValue = Math.max(value, maxValue);
      minValue = Math.min(value, minValue);
    }
  });

  const interval = (maxValue - minValue) / 50;
  const data = [...valueMap.entries()].map(e => {
    const [key, value] = e;
    const x0 = key - interval / 2;
    const x1 = key + interval / 2;
    return {
      count: value,
      x0: x0 >= minValue ? x0 : minValue,
      x1: x1 <= maxValue ? x1 : maxValue,
    };
  });
  return {
    data,
    domain: [minValue, maxValue],
    step: interval,
    dataType: 'NUMBER',
    format: '',
    color,
  };
};

