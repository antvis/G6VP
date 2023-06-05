import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { Empty } from 'antd';
import React from 'react';
import TimebarControl from './control';
import type { Aggregation, Speed, TimeFiled, TimeGranularity } from './types';

type TimebarProps = {
  /** 时间范围(时间戳) */
  timeRange: [number, number];
  /** 默认范围 */
  defaultTimeRange?: [number, number];
  /** 时间字段 */
  timeField: TimeFiled;
  /** 指标字段 */
  yField?: string;
  /**
   * 时间粒度
   *
   * 为 number 时表示自定义时间粒度(ms)
   * @example 数据按天统计，那么时间粒度为: 'day'
   */
  timeGranularity: TimeGranularity;
  /** 倍速(每 1/speed 秒播放 timeGranularity 个) */
  speed: Speed;
  aggregation: Aggregation;
};

export const Timebar: React.FC<TimebarProps> = ({
  aggregation,
  timeField,
  yField,
  timeRange,
  defaultTimeRange,
  timeGranularity,
  speed,
}) => {
  const { data } = useContext();

  if (!timeField)
    return (
      <Empty
        description="请配置时间字段"
        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      />
    );

  // 过滤出时间范围内的数据
  return (
    <TimebarControl
      aggregation={aggregation}
      data={data as GIGraphData}
      timeGranularity={timeGranularity}
      timeField={timeField}
      yField={yField}
      speed={speed}
    />
  );
};
