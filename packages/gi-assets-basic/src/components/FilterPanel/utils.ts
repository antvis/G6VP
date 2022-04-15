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
      if (analyzerType === 'SELECT') {
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
      if (analyzerType === 'SELECT') {
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
    newData.nodes = source.nodes.filter(node => validNodes.has(node.id));
  }
  return newData;
};
