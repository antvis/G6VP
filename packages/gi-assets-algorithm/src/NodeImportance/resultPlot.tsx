import { Column } from "@antv/g2plot";
import { GraphinContext } from "@antv/graphin";
import { groupBy } from "lodash";
import React, { useContext, useEffect, useRef } from "react";
import { ITEM_STATE } from "./registerMeta";

interface Props {
  data;
  currentAlgo: string;
  edgeType: string;
}

let plot: any = null;
let dataTypeLocaleMap = {};

const ResultTable: React.FC<Props> = ({ data, currentAlgo, edgeType }) => {
  const { graph } = useContext(GraphinContext);
  const plotRef = useRef(null);

  useEffect(() => {
    const plotData = getPlotData();
    if (plot) {
      plot.destroy();
    }
    //@ts-ignore
    plot = new Column(plotRef.current, {
      data: plotData,
      xField: "value",
      yField: "count",
      maxColumnWidth: 60,
      colorField: "count",
      legend: {
        layout: "horizontal",
        position: "bottom",
        offsetY: 4,
        maxRow: 2,
      },
      label: {
        position: "middle",
        style: {
          fill: "#FFFFFF",
          opacity: 0.6,
        },
      },
      xAxis: {
        title: {
          text: "重要性值",
          position: "end",
          offset: 14,
          style: {
            stroke: "#fff",
            lineWidth: 2,
            fontWeight: 400,
          },
        },
      },
      yAxis: {
        title: {
          text: "节点数量",
          position: "end",
          autoRotate: false,
          spacing: -55,
          style: {
            stroke: "#fff",
            lineWidth: 2,
            fontWeight: 400,
          },
        },
      },
    });
    plot.render();
    plot.on("interval:mouseleave", clearActiveItems);
    plot.on("interval:mouseenter", onEnterColumn);
  }, [data]);

  const getPlotData = () => {
    const plotData: any[] = [];
    const countMap = groupBy(data.node?.data || [], "value");
    Object.keys(countMap).forEach((key) => {
      plotData.push({
        //@ts-ignore
        value: key,
        //@ts-ignore
        count: countMap[key].length,
      });
    });
    return plotData;
  };

  const clearActiveItems = () => {
    const activateItems = graph
      .findAllByState("node", ITEM_STATE.Active)
      .concat(graph.findAllByState("edge", ITEM_STATE.Active));
    activateItems.forEach((item) => {
      graph.setItemState(item, ITEM_STATE.Active, false);
    });
  };

  const onEnterColumn = (e) => {
    if (!e.data?.data) {
      return;
    }
    const value = e.data?.data?.value;
    clearActiveItems();
    const nodes = data.node.data.filter((node) => +node.value === +value);
    const nodeIds = nodes.map((node) => node.id);

    nodes.forEach((node) => {
      const item = graph.findById(node.id);
      if (item) {
        graph.setItemState(item, ITEM_STATE.Active, true);
      }
    });

    // 若未关系属性重要性, 同时高亮该节点相关的被映射过的边
    if (currentAlgo === "edge-property") {
      data.edge?.data?.forEach((edge) => {
        const edgeItem = graph.findById(edge.id);
        if (!edgeItem) {
          return;
        }
        const edgeModel = edgeItem.getModel();
        if (
          nodeIds.includes(edgeModel.source) ||
          nodeIds.includes(edgeModel.target)
        ) {
          graph.setItemState(edgeItem, ITEM_STATE.Active, true);
        }
      });
    }
  };

  return (
    <div>
      <div className="plot-wrapper" ref={plotRef} />
    </div>
  );
};

export default ResultTable;
