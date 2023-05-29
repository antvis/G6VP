import { Chart } from '@antv/g2';
import { useDebounceFn } from 'ahooks';
import React, { useEffect, useRef } from 'react';
import type { Aggregation, Selection, TimeGranularity } from '../../types';
import { getTimeFormat } from '../panel/helper';

const createPathRender = (compute: any) => {
  return (group: any, options: any, document: any) => {
    if (!group.handle) {
      const path = document.createElement('path');
      group.handle = path;
      group.appendChild(group.handle);
    }
    const { handle } = group;
    const { width, height, ...rest } = options;
    if (width === undefined || height === undefined) return handle;
    handle.attr({ ...compute(width, height), ...rest });
    return handle;
  };
};

const handleW = (x: number, y: number, r: number): string => {
  const path = `M${x - r / 2},${y + r * 0.5}c${-r * 0.25},0,${-r * 0.45},${r * 0.2},${-r * 0.45},${r * 0.45}v${
    r * 3
  }c0,${r * 0.25},${r * 0.2},${r * 0.45},${r * 0.45},${r * 0.45}V${y + r * 0.5}z`;
  return path;
};

const handleE = (x: number, y: number, r: number): string => {
  const path = `M${x + r / 2},${y + r * 0.5}c${r * 0.25},0,${r * 0.45},${r * 0.2},${r * 0.45},${r * 0.45}v${r * 3}c0,${
    r * 0.25
  },${-r * 0.2},${r * 0.45},${-r * 0.45},${r * 0.45}V${y + r * 0.5}z`;
  return path;
};

export type TimebarChartProps = {
  className?: string;
  data: Record<string, any>[];
  xField: string;
  yField?: string;
  aggregation: Aggregation;
  granularity: TimeGranularity;
  // x 轴是否为时间字段类型
  isTimeXField?: boolean;
  // 用于同步图表高亮选择区域
  selection?: Selection;
  // 图表选中高亮事事件
  onSelection: (start: string, end: string) => void;
  // 图表取消高亮事件
  onReset: () => void;
};

export const TimebarChart = (props: TimebarChartProps) => {
  const {
    className,
    data = [],
    xField,
    yField,
    isTimeXField = true,
    selection,
    onSelection,
    onReset,
    aggregation,
    granularity,
  } = props;
  const chartRef = useRef<Chart>();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRenderingRef = useRef(true);

  const getAggregation = (type: Aggregation) => {
    switch (type) {
      case 'max':
      case 'mean':
      case 'min':
      case 'median':
        // yField 求均值统计
        return {
          transform: [{ type: 'groupX', y: type }],
          encode: { x: xField, y: yField },
        };
      // 分箱求和统计
      case 'count':
        return {
          transform: [{ type: 'groupX', y: 'count' }],
          encode: { x: xField },
        };
      default:
        return { encode: { x: xField, y: yField } };
    }
  };

  useEffect(() => {
    const commConfig = {
      type: 'interval',
      data: data,
      axis: {
        x: { labelAutoHide: true, title: false, labelAutoRotate: false },
        y: false,
      },
      state: { inactive: { fill: 'rgb(105 116 131)' } },
      animate: false,
      interaction: {
        tooltip: false,
        brushXHighlight: {
          series: true,
          maskOpacity: 0.3,
          maskFill: '#777',
          maskHandleWRender: createPathRender((width: number, height: number) => ({
            d: handleW(width, height / 2 - 20, 10),
          })),
          maskHandleERender: createPathRender((width: number, height: number) => ({
            d: handleE(0, height / 2 - 20, 10),
          })),
          maskHandleEFill: '#D3D8E0',
          maskHandleWFill: '#D3D8E0',
        },
      },
    };

    if (!chartRef.current) {
      chartRenderingRef.current = true;
      // 基于时间粒度设置 padding
      const timeFormat = getTimeFormat(granularity);
      const padding = timeFormat.length * 5;
      const chart = new Chart({
        container: containerRef.current!,
        theme: 'classic',
        autoFit: true,
        paddingLeft: padding,
        paddingRight: padding,
      });

      chart.options({
        type: 'view',
        style: {
          viewFill: 'transparent',
        },
        children: [{ ...commConfig, ...getAggregation(aggregation) }],
      });

      chartRef.current = chart;

      chartRef.current.render().then(() => (chartRenderingRef.current = false));
    } else {
      const update = () => {
        chartRef.current?.options({
          children: [{ ...commConfig, ...getAggregation(aggregation) }],
        });
        chartRef.current?.render().then(() => (chartRenderingRef.current = false));
      };

      if (chartRenderingRef.current) {
        chartRef.current.once('afterrender', () => {
          chartRenderingRef.current = true;
          update();
        });
      } else {
        chartRenderingRef.current = true;
        update();
      }
    }

    console.log(chartRef.current.options());
  }, [data, xField, yField, aggregation, granularity]);

  // 同步更新高丽亮滑块
  useEffect(() => {
    if (!chartRef.current || !selection || !selection[0] || !selection[1]) return;

    const update = () => {
      if (selection[0] === selection[1] || (selection[0] === -Infinity && selection[1] === Infinity)) {
        chartRef.current?.emit('brush:remove');
      } else {
        chartRef.current?.emit('brush:highlight', {
          data: {
            selection: [[...selection], [-Infinity, Infinity]],
          },
        });
      }
    };

    if (chartRenderingRef.current) {
      chartRef.current.once('afterrender', () => setTimeout(update, 1000));
    } else {
      update();
    }
  }, [selection]);

  // 绑定事件
  useEffect(() => {
    if (!chartRef.current) {
      return () => null;
    }
    const onHighlight = (e: any) => {
      const { nativeEvent, data } = e;
      if (!nativeEvent) return;
      const [selectionX] = data.selection;
      const start = selectionX[0];
      const end = selectionX[selectionX.length - 1];
      if (start === selection?.[0] && end === selection?.[1]) return;
      onSelection(start, end);
    };
    const onBrushEnd = () => onReset();

    chartRef.current.on('brush:highlight', onHighlight);
    chartRef.current.on('brush:end', onBrushEnd);

    return () => {
      if (chartRef.current) {
        chartRef.current.off('brush:highlight', onHighlight);
        chartRef.current.off('brush:end', onBrushEnd);
      }
    };
  }, [onSelection, onReset]);

  useEffect(() => {
    // 组件销毁时销毁图表
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = undefined;
      }
    };
  }, []);

  const { run: forceFit } = useDebounceFn(
    () => {
      chartRef.current?.forceFit();
    },
    { wait: 200 },
  );

  /** 监听容器尺寸变化，并触发更新 G2 尺寸 */
  useEffect(() => {
    const resizeObserver = new ResizeObserver(forceFit);
    resizeObserver.observe(containerRef.current!);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <div className={className} ref={containerRef} />;
};
