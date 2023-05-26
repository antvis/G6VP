import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { useThrottleFn } from 'ahooks';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import type { Speed } from './animation/type';
import type { Aggregation } from './chart/types';
import TimeLinePanel from './panel';
import type { Selection, TimeGranularity } from './types';
import { dataFilter, dataTransform, getTimeRange, timeParser } from './utils';

export interface TimeLineControlType {
  aggregation: Aggregation;
  data: GIGraphData;
  speed: Speed;
  timeField: string;
  timeFieldNode?: string;
  timeGranularity: TimeGranularity;
  yField?: string;
}

const isEmptyGraphData = (data: GIGraphData) =>
  !data.edges.length && !data.nodes.length;

/** 创建 G2 Mock 数据，仅做演示使用，后续移除 */
const createMockData = (data: any[], yField: string) => {
  return data.map((item) => ({
    ...item,
    [yField]: Math.random() * 100,
  }));
};

const TimeLineControl: React.FC<TimeLineControlType> = (props) => {
  const {
    aggregation,
    data,
    speed,
    timeField,
    timeFieldNode = timeField,
    timeGranularity,
    yField = 'value',
  } = props;
  const { updateContext, transform } = useContext();
  const [timeRange, setTimeRange] = useState<Selection>();
  const [renderData, setRenderData] = useState<any[]>([]);
  const rawDataRef = useRef<GIGraphData>();

  const selectFullTimeRange = () => {
    setTimeRange(getTimeRange(data, timeGranularity, timeField, timeFieldNode));
  };

  // 缓存图数据、设置 G2 渲染数据
  useEffect(() => {
    if (!rawDataRef.current && !isEmptyGraphData(data)) {
      rawDataRef.current = data;
      setRenderData(createMockData(dataTransform(data), yField));
    }
  }, [data]);

  // 更新 G2 渲染数据
  useEffect(() => {
    if (!rawDataRef.current || !timeGranularity) return;
    setRenderData(createMockData(dataTransform(rawDataRef.current), yField));
  }, [timeGranularity]);

  useEffect(() => {
    if (!timeRange || !rawDataRef.current) return;

    const newData = transform(
      dataFilter(
        rawDataRef.current,
        timeRange,
        timeGranularity,
        timeField,
        yField
      )
    );
    updateContext((draft) => {
      draft.data = newData;
    });
  }, [timeRange, rawDataRef.current]);

  const { run: onFilterChange } = useThrottleFn(
    (range: Selection) => {
      setTimeRange(
        range.map((time) => timeParser(time, timeGranularity)) as Selection
      );
    },
    { wait: 500 }
  );

  if (!timeField || isEmpty(renderData)) {
    return <Empty description="请先进行图查询" />;
  }

  // 删除筛选条件
  const disableFilter = () => {
    selectFullTimeRange();
  };

  return (
    <TimeLinePanel
      aggregation={aggregation}
      data={renderData}
      defaultSelection={timeRange}
      field={timeField}
      isTimeXField={true}
      onChangeTimeRange={onFilterChange}
      onClear={disableFilter}
      speed={speed}
      timeGranularity={timeGranularity}
      yField={yField}
    />
  );
};

export default TimeLineControl;
