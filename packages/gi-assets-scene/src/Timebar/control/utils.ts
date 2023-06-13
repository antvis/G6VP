import type { GIGraphData } from '@antv/gi-sdk';
import dayjs from 'dayjs';
import type { FieldType, Selection, TimeGranularity } from '../types';
import { getTimeFormat } from './panel/helper';

export function timeParser(time: number): number;
export function timeParser(time: string, timeGranularity?: TimeGranularity): number;
export function timeParser(time: number | string, timeGranularity?: TimeGranularity) {
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
 * @param timeField 时间字段(边)
 * @param timeFieldNode 时间字段(节点，默认与边相同)
 * @returns
 */
export function dataFilter(
  data: GIGraphData,
  range: Selection,
  timeGranularity: TimeGranularity,
  timeField: string,
  type: FieldType,
) {
  const parser = time => timeParser(time, timeGranularity);

  const baseFiltrerd = (data[type] as any[]).filter(item => {
    const time = parser(item.data[timeField]);
    return time >= parser(range[0]) && time <= parser(range[1]);
  });

  let anotherFiltered: any[] = [];
  const another: any[] = data[type === 'nodes' ? 'edges' : 'nodes'];
  if (another.length > 0) {
    if (another[0].data[timeField]) {
      anotherFiltered = another.filter(item => {
        const time = parser(item.data[timeField]);
        return time >= parser(range[0]) && time <= parser(range[1]);
      });
    }
    // 如果节点数据中没有时间字段，根据 base 数据进行筛选
    else {
      if (type === 'edges') {
        const allNodesFromEdges = baseFiltrerd.reduce((acc, cur) => {
          acc.add(cur.source);
          acc.add(cur.target);
          return acc;
        }, new Set<string>([]));
        anotherFiltered = another.filter(node => allNodesFromEdges.has(node.id));
      } else {
        const allEdgesFromNodes = baseFiltrerd.reduce((acc, cur) => {
          acc.add(cur.id);
          return acc;
        }, new Set<string>([]));
        anotherFiltered = another.filter(
          edge => allEdgesFromNodes.has(edge.source) && allEdgesFromNodes.has(edge.target),
        );
      }
    }
  }

  return {
    [type]: baseFiltrerd,
    [type === 'nodes' ? 'edges' : 'nodes']: anotherFiltered,
  } as unknown as GIGraphData;
}

/**
 * 获取图数据中的时间范围
 */
export function getTimeRange(data: Record<string, any>[], timeGranularity: TimeGranularity, timeField: string) {
  const parser = t => timeParser(t, timeGranularity);

  const times = data
    .map(datum => datum[timeField])
    .filter(Boolean)
    .map(parser);

  const timeRange: Selection = [Math.min(...times), Math.max(...times)];
  return timeRange;
}

/**
 * 转换图数据为 G2 渲染数据
 * @param data 图数据
 */
export function dataTransform(data: GIGraphData, type: FieldType) {
  return data[type].map(node => node.data);
}
