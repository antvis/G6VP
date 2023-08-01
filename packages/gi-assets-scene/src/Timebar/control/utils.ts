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
 * 从 context graph 中读取图数据，然后根据时间粒度进行筛选
 * 由于无法识别 graphData 是播放过程更新的还是外部更新的
 * 因此对每个播放的节点/边都加上 __GI_PLAYING__ 标记，用于区分
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

  const baseFiltered = (data[type] as any[]).filter(item => {
    if (!item.data[timeField]) return true;
    const time = parser(item.data[timeField]);
    return time >= parser(range[0]) && time <= parser(range[1]);
  });

  const another: any[] = data[type === 'nodes' ? 'edges' : 'nodes'];

  const addPlayingTag = <T>(data: T[]) => {
    const now = new Date().getTime();
    return data.map(datum => ({ ...datum, __GI_PLAYING__: now }));
  };

  return {
    [type]: addPlayingTag(baseFiltered),
    [type === 'nodes' ? 'edges' : 'nodes']: addPlayingTag(another),
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

/**
 * 判断图数据中是否有正在播放的节点/边
 * @param data 图数据
 * @returns 是否有正在播放的节点/边
 */
export function isPlayingData(data: GIGraphData) {
  return data.nodes.some(node => node.__GI_PLAYING__) || data.edges.some(edge => edge.__GI_PLAYING__);
}
