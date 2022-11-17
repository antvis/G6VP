import { Line } from '@antv/g2plot';
import { utils } from '@antv/gi-sdk';
import React, { useEffect } from 'react';
const { debounce } = utils;

interface LineChartProps {
  height: number | undefined;
  xField: string;
  yField: string;
  data: any;
  highlight: (ids: string[]) => void;
}

const LineChart: React.FC<LineChartProps> = props => {
  const { data, xField, yField, highlight } = props;
  const chartRef = React.useRef<null | HTMLDivElement>(null);
  if (!data) {
    return null;
  }

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    const plot = new Line(chartRef.current, {
      data,
      xField,
      yField,
      height: 200,
      interactions: [
        {
          type: 'brush-x',
        },
      ],
      xAxis: {
        label: {
          autoRotate: false,
        },
      },
    });

    plot.render();

    return () => {
      plot.destroy();
    };
  }, [data, xField, yField]);

  return <div ref={chartRef} />;
};
export default LineChart;
