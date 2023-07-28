import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { useThrottleFn } from 'ahooks';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Aggregation, DataType, FieldType, Selection, Speed, TimeGranularity } from '../types';
import TimebarPanel from './panel';
import { dataFilter, dataTransform, getTimeRange, isPlayingData, timeParser } from './utils';
import $i18n from '../../i18n';

export interface TimebarControlType {
  aggregation: Aggregation;
  graphData: GIGraphData;
  speed: Speed;
  timeField: string;
  timeGranularity: TimeGranularity;
  type: FieldType;
  yField?: string;
  playMode: 'filter' | 'highlight';
}

const isEmptyGraphData = (data: GIGraphData) => !data.edges.length && !data.nodes.length;

const TimebarControl: React.FC<TimebarControlType> = props => {
  const { aggregation, speed, timeField, timeGranularity, yField, graphData, type, playMode } = props;
  const { updateContext, transform, graph } = useContext();
  const [timeRange, setTimeRange] = useState<Selection>();
  const [renderData, setRenderData] = useState<any[]>([]);
  const graphDataRef = useRef<GIGraphData>();

  const data = useMemo<DataType>(() => {
    return graphData[type].map(datum => datum.data);
  }, [graphData, type]);

  const selectFullTimeRange = () => {
    setTimeRange(getTimeRange(data, timeGranularity, timeField));
  };

  // 缓存图数据、设置 G2 渲染数据
  useEffect(() => {
    // 如果当前数据是由播放数据转换而来，则不更新
    if (isPlayingData(graphData) || isEmptyGraphData(graphData)) return;

    graphDataRef.current = graphData;
    setRenderData(dataTransform(graphData, type as any));
  }, [graphData]);

  // 缓存图数据

  // 更新 G2 渲染数据
  useEffect(() => {
    if (!graphDataRef.current || !timeGranularity) return;
    setRenderData(dataTransform(graphDataRef.current, type));
  }, [timeGranularity]);

  useEffect(() => {
    if (!timeRange || !graphDataRef.current) return;

    const filteredData = dataFilter(graphDataRef.current, timeRange, timeGranularity, timeField, type);

    if (playMode === 'filter') {
      const newData = transform(filteredData);
      updateContext(draft => {
        draft.data = newData;
      });
    } else if (playMode === 'highlight') {
      // 遍历数据，将不在时间范围内的点、边状态置为 disable
      graphData.nodes.forEach(node => {
        const { id } = node;
        if (filteredData.nodes.some(data => data.id === id)) {
          graph.setItemState(node.id, 'highlight', true);
        } else {
          graph.setItemState(node.id, 'inactive', true);
        }
      });
      graphData.edges.forEach(edge => {
        const { id } = edge;
        if (filteredData.edges.some(data => data.id === id)) {
          graph.setItemState(edge.id, 'highlight', true);
        } else {
          graph.setItemState(edge.id, 'inactive', true);
        }
      });
    }
  }, [timeRange, graphDataRef.current]);

  const { run: onFilterChange } = useThrottleFn(
    (range: Selection) => {
      setTimeRange(range.map(time => timeParser(time, timeGranularity)) as Selection);
    },
    { wait: 500 },
  );

  if (isEmpty(renderData)) {
    return (
      <Empty description={$i18n.get({ id: 'scene.Timebar.control.PleaseQueryTheGraphFirst', dm: '请先进行图查询' })} />
    );
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
      onChangeTimeRange={onFilterChange}
      onClear={disableFilter}
      speed={speed}
      timeField={timeField}
      timeGranularity={timeGranularity}
      yField={yField}
    />
  );
};

export default TimebarControl;
