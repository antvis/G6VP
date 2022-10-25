import React, { useEffect } from "react";
import { WordCloud } from "@antv/g2plot";
import { IFilterCriteria } from "../type";

interface IWordCloudChartProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  // chartData: Map<string, number>;
}

const WordCloudChart: React.FC<IWordCloudChartProps> = (props) => {
  const { filterCriteria, updateFilterCriteria } = props;
  const { chartData = new Map() } = filterCriteria;

  useEffect(() => {
    const data = [...chartData.entries()].map((e) => {
      const [key, value] = e;
      return {
        x: key,
        value,
        category: "",
      };
    });

    const wordCloud = new WordCloud(`${filterCriteria.id}-chart-container`, {
      data,
      height: 200,
      wordField: "x",
      weightField: "value",
      color: "#122c6a",
      wordStyle: {
        fontFamily: "Verdana",
        fontSize: [10, 16],
      },
      // 设置交互类型
      interactions: [{ type: "element-active" }, { type: "element-selected" }],
      state: {
        active: {
          // 这里可以设置 active 时的样式
          style: {
            lineWidth: 3,
          },
        },
      },
    });

    wordCloud.on("element:click", ({ view }) => {
      const elements = view.geometries[0].elements;
      const selectValue = elements
        .filter((e) => e.states.indexOf("selected") !== -1)
        .map((e) => e.data.datum.x);
      const isFilterReady = selectValue.length !== 0;
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        isFilterReady,
        selectValue,
      });
    });

    wordCloud.render();

    return () => {
      wordCloud.destroy();
    };
  }, [chartData]);

  return <div id={`${filterCriteria.id}-chart-container`} />;
};
export default WordCloudChart;
