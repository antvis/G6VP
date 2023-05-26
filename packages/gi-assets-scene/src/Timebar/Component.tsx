import { useContext, type GIGraphData } from '@antv/gi-sdk';
import React from 'react';
import TimeLineControl from './control';
import type { Speed } from './control/animation/type';
import type { TimeGranularity } from './control/types';

type TimelineProps = {
  /** 时间范围(时间戳) */
  timeRange: [number, number];
  /** 默认范围 */
  defaultTimeRange?: [number, number];
  /** 时间字段 */
  timeField: string;
  /** 指标字段 */
  yField?: string;
  /** 默认播放 */
  defaultPlay?: boolean;
  /**
   * 时间粒度
   *
   * 为 number 时表示自定义时间粒度(ms)
   * @example 数据按天统计，那么时间粒度为: 'day'
   */
  timeGranularity: TimeGranularity;
  /** 倍速(每 1/speed 秒播放 timeGranularity 个) */
  speed: Speed;
  aggregation: 'mean' | 'count' | 'value';
};

export const Timebar: React.FC<TimelineProps> = ({
  aggregation,
  timeField = 'edge:GI_TIME_STAMP',
  yField,
  timeRange,
  defaultPlay,
  defaultTimeRange,
  timeGranularity,
  speed,
}) => {
  const { data } = useContext();

  const [type, field] = timeField.split(':');

  // 过滤出时间范围内的数据
  return (
    <TimeLineControl
      aggregation={aggregation}
      data={data as GIGraphData}
      timeGranularity={timeGranularity}
      timeField={field}
      yField={yField}
      speed={speed}
    />
  );
};
