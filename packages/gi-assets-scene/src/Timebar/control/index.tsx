import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { useThrottleFn } from 'ahooks';
import { Empty } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Aggregation, DataType, FieldType, Selection, Speed, TimeGranularity } from '../types';
import TimebarPanel from './panel';
import { dataFilter, dataTransform, getTimeRange, isPlayingData, timeParser } from './utils';
import $i18n from '../../i18n';

let initiated = false;
export interface TimebarControlType {
  aggregation: Aggregation;
  graphData: GIGraphData;
  speed: Speed;
  timeField: string;
  timeGranularity: TimeGranularity;
  type: FieldType;
  yField?: string;
  playMode: 'filter' | 'highlight' | 'show-hide';
  defaultTimeLength?: 'all' | 'day' | 'month' | 'year';
}

const isEmptyGraphData = (data: GIGraphData) => !data.edges.length && !data.nodes.length;

const TimebarControl: React.FC<TimebarControlType> = props => {
  const { aggregation, speed, timeField, timeGranularity, yField, graphData, type, playMode, defaultTimeLength } =
    props;
  const { updateContext, transform, graph } = useContext();
  const [timeRange, setTimeRange] = useState<Selection>();
  const [renderData, setRenderData] = useState<any[]>([]);
  const [defaultTimeRange, setDefaultTimeRange] = useState<Selection>();
  const graphDataRef = useRef<GIGraphData>();

  const data = useMemo<DataType>(() => {
    return graphData[type].map(datum => datum.data);
  }, [graphData, type]);

  useEffect(() => {
    setTimeRange(defaultTimeRange);
  }, [defaultTimeRange]);

  const selectFullTimeRange = () => {
    setTimeRange(getTimeRange(data, timeGranularity, timeField));
  };

  // 删除筛选条件
  const disableFilter = () => {
    selectFullTimeRange();
  };

  useEffect(() => {
    if (!data?.length) return;
    if (initiated) {
      initiated = true;
      return;
    }
    setTimeout(() => {
      const graphTimeRange = getTimeRange(data, timeGranularity, timeField);
      switch (defaultTimeLength) {
        case 'all':
          onFilterChange(graphTimeRange);
          setDefaultTimeRange(graphTimeRange);
          return;
        case 'day':
          onFilterChange([graphTimeRange[0], graphTimeRange[0] + 86400000]);
          return;
        case 'month':
          onFilterChange([graphTimeRange[0], graphTimeRange[0] + 2678400000]);
          return;
        case 'year':
          onFilterChange([graphTimeRange[0], graphTimeRange[0] + 31536000000]);
          return;
        default:
          return;
      }
    });
  }, [defaultTimeLength, data]);

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
    } else if (playMode === 'show-hide') {
      // 遍历数据，将不在时间范围内的点、边状态置为 disable
      const shownNodes = {};
      graphData.nodes.forEach(node => {
        const { id } = node;
        if (!item || item.destroyed) return;
        if (filteredData.nodes.some(data => data.id === id)) {
          graph.showItem(id);
          shownNodes[id] = true;
        } else {
          graph.hideItem(id);
        }
      });
      graphData.edges.forEach(edge => {
        const { id, source, target } = edge;
        const item = graph.findById(id);
        if (!item || item.destroyed) return;
        if (filteredData.edges.some(data => data.id === id) && shownNodes[source] && shownNodes[target]) {
          graph.showItem(id);
        } else {
          graph.hideItem(id);
        }
      });
    }

    graph.emit('timechange', { timeRange });
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
      defaultTimeRange={defaultTimeRange}
    />
  );
};

export default TimebarControl;
