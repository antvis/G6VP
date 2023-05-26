import { ClockCircleOutlined } from '@ant-design/icons';
import { useUpdateEffect } from 'ahooks';
import React, { useMemo, useState } from 'react';
import TimeLineAnimation from '../animation';
import type { Speed } from '../animation/type';
import { TimeLineChart } from '../chart';
import type { Aggregation } from '../chart/types';
import type { TimeGranularity } from '../types';
import { getFormatData, getInitTimeRange, getTimeFormat } from './helper';
import './index.less';
import type { Selection } from './types';

type Props = {
  aggregation: Aggregation;
  data: Record<string, any>[];
  defaultSelection?: Selection;
  field: string;
  isTimeXField: boolean;
  onChangeTimeRange: (val: Selection) => void;
  onClear: () => void;
  speed?: Speed;
  timeGranularity: TimeGranularity;
  yField?: string;
};

const TimeLinePanel: React.FC<Props> = props => {
  const {
    aggregation,
    data: orignalData,
    defaultSelection,
    field,
    isTimeXField,
    onChangeTimeRange,
    onClear,
    speed,
    timeGranularity,
    yField,
  } = props;

  const dataTimes = useMemo(() => {
    const data = getFormatData(orignalData, field, isTimeXField, getTimeFormat(timeGranularity));
    const line: string[] = data.map(item => item[field]);
    const times = [...new Set(line)];

    return { data, times };
  }, [orignalData, field, isTimeXField]);

  const [initSelection, setInitSelection] = useState<Selection>(getInitTimeRange(dataTimes.times));
  // 当前选中区间
  const [currentSelectedRange, setCurrentSelectedRange] = useState<Selection | undefined>(initSelection);
  // 同步图标选中区间
  const [chartSelectedRange, setChartSelectedRange] = useState<Selection>(initSelection);

  // 当数据源发生更新变化时（配置状态切换数据源和时间字段），重置选中区间
  useUpdateEffect(() => {
    const initTimeRange = getInitTimeRange(dataTimes.times);
    setInitSelection(initTimeRange);
    setCurrentSelectedRange(undefined);
    // setChartSelectionRange(initTimeRange);
  }, [dataTimes.times]);

  const selectionTime = useMemo(() => {
    if (currentSelectedRange) {
      return `${currentSelectedRange[0]} 至 ${currentSelectedRange[1]}`;
    }

    return `${dataTimes.times[0]} 至 ${dataTimes.times[1]}`;
  }, [currentSelectedRange, dataTimes.times]);

  // 移动框选事件
  const onSelection = (start: string, end: string) => {
    if (start && end) {
      setCurrentSelectedRange([start, end]);
      setInitSelection([start, end]);
      onChangeTimeRange([start, end]);
    }
  };

  const onSelectionAnimation = (val: Selection) => {
    setCurrentSelectedRange(val);
    setChartSelectedRange(val);
    onChangeTimeRange(val);
  };

  // 图表取消高亮事件
  const onChartReset = () => {
    // 删除筛选条件
    onClear();
    setCurrentSelectedRange(undefined);
  };

  // 按钮控制取消高亮事件
  const onReset = () => {
    onChartReset();
    setChartSelectedRange([-Infinity, Infinity]);
  };

  return (
    <div className="content">
      <div className="content-header">
        <div className="content-header-field">
          <ClockCircleOutlined />
          {field}
        </div>
        <div className="content-header-time">
          <span>{selectionTime}</span>
        </div>
      </div>

      <TimeLineChart
        className="chart"
        data={dataTimes.data}
        xField={field}
        yField={yField}
        isTimeXField={isTimeXField}
        selection={chartSelectedRange}
        aggregation={aggregation}
        granularity={timeGranularity}
        onSelection={onSelection}
        onReset={onChartReset}
      />

      <TimeLineAnimation
        className="content-btn"
        timeLine={dataTimes.times}
        selection={currentSelectedRange}
        initialSelection={initSelection}
        setSelection={onSelectionAnimation}
        defaultSpeed={speed}
        onReset={onReset}
      />
    </div>
  );
};

export default TimeLinePanel;
