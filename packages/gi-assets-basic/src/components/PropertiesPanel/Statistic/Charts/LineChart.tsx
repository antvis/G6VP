import React, { useEffect } from "react";
import { Line } from "@antv/g2plot";
import { nanoid } from 'nanoid';

interface LineChartProps {
  xField: string;
  yField: string;
  data: any;
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { data, xField, yField } = props;
  
  const uid = React.useMemo(() => nanoid(), [])

  useEffect(() => {
    const linePlot = new Line(`${uid}-linechart-container`, {
      data,
      xField,
      yField,
      height: 350
    });

    linePlot.render();
    return () => {
      linePlot.destroy();
    };
  }, [data, xField, yField]);

  return <div id={`${uid}-linechart-container`} />;
};
export default LineChart;
