import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { Empty, message } from 'antd';
import React from 'react';
import TimebarControl from './control';
import type { Aggregation, Speed, TimeGranularity } from './types';
import $i18n from '../i18n';

type TimebarProps = {
  /** 时间范围(时间戳) */
  timeRange: [number, number];
  /** 默认范围 */
  defaultTimeLength?: 'all' | 'day' | 'month' | 'year';
  /** 时间字段 */
  timeField: string;
  /** 指标字段 */
  yField: string;
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
  /** 播放模式：过滤/高亮 */
  playMode: 'filter' | 'highlight' | 'show-hide';
};

export const Timebar: React.FC<TimebarProps> = ({
  aggregation,
  timeField,
  yField,
  timeRange,
  defaultTimeLength,
  timeGranularity,
  speed,
  playMode,
}) => {
  const { data: graphData } = useContext();

  if (!timeField || !yField)
    return (
      <Empty
        description={$i18n.get({ id: 'scene.src.Timebar.Component.PleaseConfigureTheTimeField', dm: '请配置时间字段' })}
        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      />
    );

  const [xType, _timeField] = timeField.split(':');
  const [yType, _yField] = yField.split(':');

  if (xType !== yType) {
    message.warning(
      $i18n.get({
        id: 'scene.src.Timebar.Component.MakeSureThatTheTime',
        dm: '请确保时间字段和指标字段同属于节点或边！',
      }),
    );
    return null;
  }

  // 过滤出时间范围内的数据
  return (
    <TimebarControl
      aggregation={aggregation}
      graphData={graphData as GIGraphData}
      speed={speed}
      timeField={_timeField}
      timeGranularity={timeGranularity}
      type={xType as any}
      yField={_yField}
      playMode={playMode}
      defaultTimeLength={defaultTimeLength}
    />
  );
};
