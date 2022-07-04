import React, { useEffect } from "react";
import { Line } from "@antv/g2plot";

interface LineChartProps {
  xField: string;
  yField: string;
  data: any;
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { data, xField, yField } = props;
  console.log("data:", data)

  useEffect(() => {
    const linePlot = new Line("gi-statistic-linechart-container", {
      data,
      xField,
      yField,
      width: 300
    });

    linePlot.render();
    return () => {
      linePlot.destroy();
    };
  }, [data, xField, yField]);

  return <div id="gi-statistic-linechart-container" />;
};
export default LineChart;
