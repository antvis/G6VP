import React, { useEffect } from "react";
import { Pie } from "@antv/g2plot";
import { IFilterCriteria } from "../type";

interface IPieChartProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  //chartData: Map<string, number>;
}

const PieChart: React.FC<IPieChartProps> = (props) => {
  const { filterCriteria, updateFilterCriteria } = props;
  const { chartData = new Map() } = filterCriteria;

  useEffect(() => {
    const sum = [...chartData.values()].reduce((acc, cur) => acc + cur, 0);
    const data = [...chartData.entries()].map((e) => {
      const [key, value] = e;
      return {
        x: key,
        value,
      };
    });

    const piePlot = new Pie(`${filterCriteria.id}-chart-container`, {
      height: 200,
      data,
      angleField: "value",
      colorField: "x",
      radius: 0.9,
      label: {
        type: "inner",
        offset: "-30%",
        content: ({ value }) => `${((value / sum) * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: "center",
        },
      },
      interactions: [{ type: "element-selected" }, { type: "element-active" }],
    });

    piePlot.render();

    piePlot.on("element:click", ({ view }) => {
      const id = filterCriteria.id as string;
      const elements = view.geometries[0].elements;
      const selectValue = elements
        .filter((e) => e.states.indexOf("selected") != -1)
        .map((e) => e.data.x);
      const isFilterReady = selectValue.length != 0;
      updateFilterCriteria(id, {
        ...filterCriteria,
        isFilterReady,
        selectValue,
      });
    });

    return () => {
      piePlot.destroy();
    };
  }, [chartData]);

  return <div id={`${filterCriteria.id}-chart-container`} />;
};

export default PieChart;
