import { Column, G2 } from '@antv/g2plot';
import React, { useEffect } from 'react';

import { utils } from '@antv/gi-sdk';

const { debounce } = utils;
interface ColumnChartProps {
  height: number | undefined;
  xField: string;
  yField: string;
  data: any;
  highlight: (ids: string[]) => void;
}

const ColumnChart: React.FC<ColumnChartProps> = props => {
  const { data, xField, yField, highlight, height } = props;
  const chartRef = React.useRef<null | HTMLDivElement>(null);
  if (!data) {
    return null;
  }

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const plot = new Column(chartRef.current, {
      data,
      xField,
      yField,
      height,
      brush: {
        enabled: true,
        type: 'x-rect',
        action: 'highlight',
      },
      xAxis: {
        label: {
          autoRotate: false,
        },
      },
      slider: {
        start: 0,
        end: 1,
      },
      minColumnWidth: 12,
      // padding: [8, 4, 8, 4],
      // maxColumnWidth: 12,
    });

    plot.render();

    // 监听状态变化
    const handleHighlight = evt => {
      const { highlightElements = [] } = evt.data;
      const ids = highlightElements.map(ele => ele.getData().id);

      highlight(ids);
    };
    plot.on(G2.ELEMENT_RANGE_HIGHLIGHT_EVENTS.AFTER_HIGHLIGHT, debounce(handleHighlight, 250));

    plot.on(G2.ELEMENT_RANGE_HIGHLIGHT_EVENTS.AFTER_CLEAR, () => {
      // 取消激活
    });

    return () => {
      plot.destroy();
    };
  }, [data, xField, yField, height]);

  return <div ref={chartRef} />;
};
export default ColumnChart;
