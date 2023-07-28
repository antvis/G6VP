import { ClockCircleOutlined } from '@ant-design/icons';
import { useUpdateEffect } from 'ahooks';
import React, { useMemo, useState } from 'react';
import type { Aggregation, Selection, Speed, TimeGranularity } from '../../types';
import TimebarAnimation from '../animation';
import { TimebarChart } from '../chart';
import { getFormatData, getInitTimeRange, getTimeFormat } from './helper';
import './index.less';
import $i18n from '../../../i18n';

type Props = {
  aggregation: Aggregation;
  data: Record<string, any>[];
  defaultSelection?: Selection;
  timeField: string;
  onChangeTimeRange: (val: Selection) => void;
  onClear: () => void;
  speed?: Speed;
  timeGranularity: TimeGranularity;
  yField?: string;
};

const TimebarPanel: React.FC<Props> = props => {
  const {
    aggregation,
    data: originalData,
    defaultSelection,
    timeField,
    onChangeTimeRange,
    onClear,
    speed,
    timeGranularity,
    yField,
  } = props;

  const dataTimes = useMemo(() => {
    const data = getFormatData(originalData, timeField, getTimeFormat(timeGranularity));
    const line: string[] = data.map(item => item[timeField]);
    const times = [...new Set(line)];

    return { data, times };
  }, [originalData, timeField]);

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
      return $i18n.get(
        {
          id: 'scene.control.panel.CurrentselectedrangeToCurrentselectedrange',
          dm: '{currentSelectedRangeStart} 至 {currentSelectedRangeEnd}',
        },
        { currentSelectedRangeStart: currentSelectedRange[0], currentSelectedRangeEnd: currentSelectedRange[1] },
      );
    }

    return $i18n.get(
      {
        id: 'scene.control.panel.DatatimestimesToDatatimestimes',
        dm: '{dataTimesTimesStart} 至 {dataTimesTimesEnd}',
      },
      { dataTimesTimesStart: dataTimes.times[0], dataTimesTimesEnd: dataTimes.times[1] },
    );
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

  console.log('dataTimes', dataTimes);

  return (
    <div className="content">
      <div className="content-header">
        <div className="content-header-field">
          <ClockCircleOutlined />
          {timeField}
        </div>
        <div className="content-header-time">
          <span>{selectionTime}</span>
        </div>
      </div>

      <TimebarChart
        className="chart"
        data={dataTimes.data}
        xField={timeField}
        yField={yField}
        selection={chartSelectedRange}
        aggregation={aggregation}
        granularity={timeGranularity}
        onSelection={onSelection}
        onReset={onChartReset}
      />

      <TimebarAnimation
        className="content-btn"
        timebar={dataTimes.times}
        selection={currentSelectedRange}
        initialSelection={initSelection}
        setSelection={onSelectionAnimation}
        defaultSpeed={speed}
        onReset={onReset}
      />
    </div>
  );
};

export default TimebarPanel;
