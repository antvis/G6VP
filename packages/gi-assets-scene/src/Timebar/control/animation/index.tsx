import {
  BoxPlotOutlined,
  CaretRightOutlined,
  ColumnWidthOutlined,
  ForwardOutlined,
  PauseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Popover, Radio, Space, Tooltip } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Selection } from '../panel/types';
import { playbackSpeedList, timeWindowList } from './constants';
import { getKeySteps, getTimeInterval } from './helper';
import type { Speed, TimeWindowType } from './type';
import './index.less';

type Props = {
  className?: string;
  defaultSpeed?: Speed;
  timeLine: string[];
  initialSelection: Selection;
  selection?: Selection; // 选择时间区间
  setSelection: (val: Selection) => void; // 设置选中区间值
  onReset?: () => void;
};

const TimeLineAnimation: React.FC<Props> = (props) => {
  const {
    className,
    setSelection,
    selection,
    timeLine,
    defaultSpeed = 1,
    initialSelection,
    onReset,
  } = props;
  const [timeWindowType, setTimeWindowType] =
    useState<TimeWindowType>('moveTime');
  const [speed, setSpeed] = useState<Speed>(1);
  const [isAnimation, setIsAnimation] = useState(false);
  const timer = useRef<number | null>(null);

  const steps = useMemo(() => {
    const { steps } = getKeySteps(timeLine, initialSelection);
    return steps;
  }, [initialSelection, timeLine]);

  // 动画播放操作
  const timerAnimation = (val: {
    speed: Speed;
    timeWindowType: TimeWindowType;
    selection: Selection;
    playback?: boolean;
  }) => {
    if (timer.current) {
      window.cancelAnimationFrame(timer.current);
      timer.current = null;
    }
    const { speed = 1, timeWindowType, selection, playback } = val;

    if (speed > 0) {
      //  延迟时间  const delay = (BASE_SPEED * (1000 / FPS)) / steps.length / (speed || 1);
      const delay = (600 * (1000 / 60)) / (steps || 1) / (speed || 1);
      let _startTime = new Date().getTime();

      const loop = () => {
        const current = new Date().getTime();
        const delta = current - _startTime;

        if (delta >= delay) {
          _startTime = new Date().getTime();
          const timeIntervals = getTimeInterval(
            timeLine,
            selection,
            timeWindowType,
            playback
          );
          if (timeIntervals) {
            setSelection(timeIntervals);
          }
        } else {
          timer.current = window.requestAnimationFrame(loop);
        }
      };

      timer.current = window.requestAnimationFrame(loop);
    }
  };

  const onTimeWindowChange = (e: TimeWindowType) => {
    setTimeWindowType(e);
    if (isAnimation && selection) {
      timerAnimation({ speed, timeWindowType: e, selection });
    }
  };

  const onplaybackSpeedChange = (e: Speed) => {
    setSpeed(e);
    if (isAnimation && selection) {
      timerAnimation({ speed: e, timeWindowType, selection });
    }
  };

  // 动画播放操作
  const onIsAnimationChange = () => {
    if (!selection) {
      return;
    }
    setIsAnimation(!isAnimation);
    if (!isAnimation) {
      timerAnimation({ speed, timeWindowType, selection });
    } else {
      if (timer.current) {
        window.cancelAnimationFrame(timer.current);
        timer.current = null;
      }
    }
  };

  // 动画还原操作
  const playbackRestoration = () => {
    if (isAnimation && selection) {
      timerAnimation({ speed, timeWindowType, selection, playback: true });
    } else {
      setSelection(initialSelection);
    }
  };

  // 取消选中
  const onCancelSelected = () => {
    if (onReset) onReset();
    if (isAnimation) {
      onIsAnimationChange();
    }
  };

  useEffect(() => {
    if (defaultSpeed) setSpeed(defaultSpeed);
  }, [defaultSpeed]);

  useEffect(() => {
    if (isAnimation && selection) {
      timerAnimation({ speed, timeWindowType, selection });
    }
  }, [selection]);

  const TimeWindow = (
    <Radio.Group
      onChange={(e) => onTimeWindowChange(e.target.value)}
      value={timeWindowType}
    >
      <Space direction="vertical">
        {timeWindowList.map((item) => {
          return (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          );
        })}
      </Space>
    </Radio.Group>
  );

  const PlaybackSpeed = (
    <Radio.Group
      onChange={(e) => onplaybackSpeedChange(e.target.value)}
      value={speed}
    >
      <Space direction="vertical">
        {playbackSpeedList.map((item) => {
          return (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          );
        })}
      </Space>
    </Radio.Group>
  );

  return (
    <div className={className}>
      <Popover content={TimeWindow} overlayStyle={{ padding: 0 }}>
        <div className="content-btn-item">
          <ColumnWidthOutlined />
        </div>
      </Popover>
      <Popover content={PlaybackSpeed} overlayStyle={{ padding: 0 }}>
        <div className="content-btn-item">
          <ForwardOutlined />
        </div>
      </Popover>
      <div className="content-btn-item" onClick={onIsAnimationChange}>
        <Button type="link" onClick={onIsAnimationChange} disabled={!selection}>
          <Tooltip title={selection ? '' : '请先框选区间'}>
            {isAnimation ? <PauseOutlined /> : <CaretRightOutlined />}
          </Tooltip>
        </Button>
      </div>
      <div className="content-btn-item">
        <Button type="link" onClick={playbackRestoration}>
          <ReloadOutlined />
        </Button>
      </div>
      <div className="content-btn-item">
        <Button type="link" disabled={!selection} onClick={onCancelSelected}>
          <BoxPlotOutlined />
        </Button>
      </div>
    </div>
  );
};

export default TimeLineAnimation;
