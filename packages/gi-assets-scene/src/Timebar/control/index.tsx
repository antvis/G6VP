import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { useThrottleFn } from 'ahooks';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import type { Aggregation, Selection, Speed, TimeGranularity, TimeFiled } from '../types';
import TimebarPanel from './panel';
import { dataFilter, dataTransform, getTimeRange, timeParser } from './utils';

export interface TimebarControlType {
  aggregation: Aggregation;
  data: GIGraphData;
  speed: Speed;
  timeField: TimeFiled;
  timeFieldNode?: string;
  timeGranularity: TimeGranularity;
  yField?: string;
}

const isEmptyGraphData = (data: GIGraphData) => !data.edges.length && !data.nodes.length;

const TimebarControl: React.FC<TimebarControlType> = props => {
  const { aggregation, data, speed, timeField, timeFieldNode = timeField, timeGranularity, yField } = props;
  const { updateContext, transform } = useContext();
  const [timeRange, setTimeRange] = useState<Selection>();
  const [renderData, setRenderData] = useState<any[]>([]);
  const rawDataRef = useRef<GIGraphData>();

  const selectFullTimeRange = () => {
    setTimeRange(getTimeRange(data, timeGranularity, timeField, timeFieldNode));
  };

  const [type, field] = timeField.split(':');

  // 缓存图数据、设置 G2 渲染数据
  useEffect(() => {
    if (!rawDataRef.current && !isEmptyGraphData(data)) {
      rawDataRef.current = data;
    }
  }, [data]);

  // 更新 G2 渲染数据
  useEffect(() => {
    if (!rawDataRef.current || !timeGranularity) return;
    setRenderData(dataTransform(rawDataRef.current, type as any));
  }, [data, field]);

  useEffect(() => {
    if (!timeRange || !rawDataRef.current) return;

    const newData = transform(dataFilter(rawDataRef.current, timeRange, timeGranularity, field, yField));
    updateContext(draft => {
      draft.data = newData;
    });
  }, [timeRange, rawDataRef.current]);

  const { run: onFilterChange } = useThrottleFn(
    (range: Selection) => {
      setTimeRange(range.map(time => timeParser(time, timeGranularity)) as Selection);
    },
    { wait: 500 },
  );

  if (!field || isEmpty(renderData)) {
    return <Empty description="请先进行图查询" />;
  }

  // 删除筛选条件
  const disableFilter = () => {
    selectFullTimeRange();
  };

  return (
    <TimebarPanel
      aggregation={aggregation}
      data={renderData}
      defaultSelection={timeRange}
      field={field}
      isTimeXField={true}
      onChangeTimeRange={onFilterChange}
      onClear={disableFilter}
      speed={speed}
      timeGranularity={timeGranularity}
      yField={yField}
    />
  );
};

export default TimebarControl;
