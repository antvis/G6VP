import React, { useEffect } from "react";
import { Histogram, G2 } from "@antv/g2plot";
import { IFilterCriteria, IHistogramValue } from "../type";

interface IHistogramChartProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
}

const HistogramChart: React.FC<IHistogramChartProps> = (props) => {
  const { filterCriteria, updateFilterCriteria } = props;
  const { histogramData = [{}] } = filterCriteria;

  useEffect(() => {
    G2.registerInteraction("element-highlight", {
      start: [{ trigger: "element:click", action: "element-highlight:toggle" }],
    });
  }, []);

  useEffect(() => {
    const histogramPlot = new Histogram(
      `${filterCriteria.id}-chart-container`,
      {
        data: histogramData,
        height: 200,
        binField: "value",
        color: "rgba(111, 147, 222, 1)",
        tooltip: {},
        interactions: [{ type: "element-highlight" }],
        state: {
          // 设置 active 激活状态的样式
          active: {
            style: {
              fill: "rgba(56, 83, 215, 1)",
              lineWidth: 0,
            },
          },
        },
        meta: {
          range: { nice: true },
          count: {
            type: "log",
            nice: true,
          },
        },
      }
    );

    histogramPlot.on("element:click", ({ view }) => {
      const elements = view.geometries[0].elements;
      const selectRanges = elements
        .filter((e) => e.states.indexOf("active") !== -1)
        .map((e) => e.data.range);
      const isFilterReady = selectRanges.length !== 0;
      /* const range = isFilterReady
      ? [selectRanges[0][0], selectRanges[selectRanges.length - 1][1]]
      : undefined; */
      updateFilterCriteria(filterCriteria.id!, {
        ...filterCriteria,
        isFilterReady,
        range: selectRanges,
      });
    });

    histogramPlot.render();

    // 初次渲染时，处于筛选范围内的图表元素高亮
    histogramPlot.setState("active", (item: any) => {
      if (!filterCriteria.range || !filterCriteria.isFilterReady) return false;
      for (let arr of filterCriteria.range) {
        const min = arr[0];
        const max = arr[1];
        if (item.range[0] === min && item.range[1] === max) {
          return true;
        }
      }
      return false;
      //const min = filterCriteria.range[0];
      //const max = filterCriteria.range[1];
      //return item.range[0] >= min && item.range[1] <= max;
    });

    histogramPlot.setState("inactive", (item: any) => {
      if (!filterCriteria.range || !filterCriteria.isFilterReady) return false;
      for (let arr of filterCriteria.range) {
        const min = arr[0];
        const max = arr[1];
        if (item.range[0] === min && item.range[1] === max) {
          return false;
        }
      }
      return true;
      //const min = filterCriteria.range[0];
      //const max = filterCriteria.range[1];
      //return item.range[0] < min || item.range[1] > max;
    });

    return () => {
      histogramPlot.destroy();
    };
  }, [histogramData]);

  return <div id={`${filterCriteria.id}-chart-container`} />;
};

export default HistogramChart;
