import React, { useEffect } from "react";
import { Column } from "@antv/g2plot";
import { nanoid } from 'nanoid';

interface ColumnChartProps {
  xField: string;
  yField: string;
  data: any;
}

const ColumnChart: React.FC<ColumnChartProps> = (props) => {
  const { data, xField, yField } = props;

  const uid = React.useMemo(() => nanoid(), [])

  useEffect(() => {
    const linePlot = new Column(`${uid}-linechart-container`, {
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
export default ColumnChart;
