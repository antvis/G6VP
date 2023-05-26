import dayjs from 'dayjs';
import type { GIGraphData } from '@antv/gi-sdk';
import type { Selection, TimeGranularity } from './types';
import { getTimeFormat } from './panel/helper';

export function timeParser(time: number): number;
export function timeParser(
  time: string,
  timeGranularity?: TimeGranularity
): number;
export function timeParser(
  time: number | string,
  timeGranularity?: TimeGranularity
) {
  if (typeof time === 'number') {
    if (time.toString().length === 10) return time * 1000;
    return time;
  }
  return dayjs(time, getTimeFormat(timeGranularity!)).valueOf(); //new Date(time).getTime();
}

/**
 * 根据时间范围筛选图数据
 * @param data 图数据
 * @param range 时间范围
 * @param timeFieldEdge 时间字段(边)
 * @param timeFieldNode 时间字段(节点，默认与边相同)
 * @returns
 */
export function dataFilter(
  data: GIGraphData,
  range: Selection,
  timeGranularity: TimeGranularity,
  timeFieldEdge: string,
  timeFieldNode: string = timeFieldEdge
): GIGraphData {
  const { nodes = [], edges = [] } = data;

  const parser = (t) => timeParser(t, timeGranularity);

  const edgesFiltered = edges.filter((edge) => {
    const time = parser(edge.data[timeFieldEdge]);
    return time >= parser(range[0]) && time <= parser(range[1]);
  });

  let nodesFiltered: GIGraphData['nodes'] = [];
  if (nodes.length > 0) {
    if (nodes[0].data[timeFieldNode]) {
      nodesFiltered = nodes.filter((node) => {
        const time = parser(node.data[timeFieldNode]);
        return time >= parser(range[0]) && time <= parser(range[1]);
      });
    }
    // 如果节点数据中没有时间字段，根据边数据进行筛选
    else {
      const allNodesFromEdges = edgesFiltered.reduce((acc, cur) => {
        acc.add(cur.source);
        acc.add(cur.target);
        return acc;
      }, new Set<string>([]));
      nodesFiltered = nodes.filter((node) => allNodesFromEdges.has(node.id));
    }
  }

  return {
    nodes: nodesFiltered,
    edges: edgesFiltered,
  };
}

/**
 * 获取图数据中的时间范围
 */
export function getTimeRange(
  data: GIGraphData,
  timeGranularity: TimeGranularity,
  timeFieldEdge: string,
  timeFieldNode: string = timeFieldEdge
) {
  const { nodes, edges } = data;
  const parser = (t) => timeParser(t, timeGranularity);
  const nodesTime = nodes
    .map((node) => node.data[timeFieldNode])
    .filter(Boolean)
    .map(parser);
  const edgesTime = edges.map((edge) => edge.data[timeFieldEdge]).map(parser);
  const times = [...nodesTime, ...edgesTime];
  const timeRange: Selection = [Math.min(...times), Math.max(...times)];
  return timeRange;
}

/**
 * 转换图数据为 G2 渲染数据
 * @param data 图数据
 */
export function dataTransform(data: GIGraphData) {
  return data.edges.map((edge) => edge.data);
}
