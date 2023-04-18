import React from 'react';
import Chart from './Charts';

export interface TimeChartProps {
  title: string;
  chartType: 'lineChart' | 'columnChart';
  height: number | undefined;
  dataType: 'nodes' | 'edges';
  xField_nodes: string;
  yField_nodes: string;
  xField_edges: string;
  yField_edges: string;
  brushMode: 'filter' | 'highlight' | undefined;
}

const TimeChart: React.FunctionComponent<TimeChartProps> = props => {
  const { chartType, height, dataType, title, brushMode } = props;
  console.log(' props', props);

  return (
    <div>
      <Chart
        brushMode={brushMode}
        title={title}
        height={height}
        xField={props[`xField_${dataType}`]}
        yField={props[`yField_${dataType}`]}
        chartType={chartType}
        dataType={dataType}
      />
    </div>
  );
};

export default TimeChart;
