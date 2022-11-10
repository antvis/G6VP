import { S2Event, SpreadSheet } from '@antv/s2';
import React from 'react';

import { useContext } from '@antv/gi-sdk';
import { highlightBySelectedEdges, highlightBySelectedNodes } from '../utils/highlight';

const useCellSelect = (
  isSelectedActive: boolean,
  s2Instance: { nodeTable: SpreadSheet | null; edgeTable: SpreadSheet | null },
  isFullScreen: boolean,
) => {
  const context = useContext();
  const { data: graphData, graph, largeGraphData, updateContext } = context;
  const { nodeTable, edgeTable } = s2Instance;
  React.useEffect(() => {
    if (nodeTable) {
      /** 圈选点表 */
      nodeTable.on(S2Event.GLOBAL_SELECTED, () => {
        // isSelectedActiv 为 false 或全屏时，不高亮选中元素
        if (!isSelectedActive || isFullScreen) {
          return;
        }
        const cells = nodeTable.interaction.getCells();

        const selectedNodes = new Set<string>();

        cells.forEach(cell => {
          const { rowIndex } = cell;
          // @ts-ignore
          const rowData = nodeTable.dataSet.getMultiData();
          if (!rowData) return;
          const nodeID = rowData[rowIndex]?.id;
          selectedNodes.add(nodeID);
        });
        highlightBySelectedNodes(selectedNodes, { updateContext, largeGraphData, data: graphData, graph });
      });
    }

    if (edgeTable) {
      /** 圈选边表 */
      edgeTable.on(S2Event.GLOBAL_SELECTED, () => {
        // isSelectedActiv 为 false 或全屏时，不高亮选中元素
        if (!isSelectedActive || isFullScreen) {
          return;
        }
        const cells = edgeTable.interaction.getCells();
        const selectedEdges = new Set<string>();
        cells.forEach(cell => {
          const { rowIndex } = cell;
          // @ts-ignore
          const rowData = edgeTable.dataSet.getMultiData();
          if (!rowData) return;
          const rd = rowData[rowIndex];
          const { id: edgeID, GI_AGGREGATE_ID } = rd;
          selectedEdges.add(GI_AGGREGATE_ID ? GI_AGGREGATE_ID : edgeID);
        });

        highlightBySelectedEdges(selectedEdges, { updateContext, largeGraphData, data: graphData, graph });
      });
    }
    /** 通过 postMessage 通信的 */
    const handleNodesCellMessage = e => {
      const { payload, type } = e.data;
      /** ${Onwer}_${ComponentName}_${Action} */
      if (type === 'GI_TABLEMODE_SELECT' && payload && payload.selectedNodes) {
        highlightBySelectedNodes(payload.selectedNodes, { updateContext, largeGraphData, data: graphData, graph });
      }
    };
    const handleEdgesCellMessage = e => {
      const { payload, type } = e.data;
      if (type === 'GI_TABLEMODE_SELECT' && payload.selectedEdges) {
        highlightBySelectedEdges(payload.selectedEdges, { updateContext, largeGraphData, data: graphData, graph });
      }
    };
    window.addEventListener('message', handleNodesCellMessage);
    window.addEventListener('message', handleEdgesCellMessage);

    return () => {
      nodeTable?.off(S2Event.GLOBAL_SELECTED);
      edgeTable?.off(S2Event.GLOBAL_SELECTED);
      window.removeEventListener('message', handleEdgesCellMessage);
      window.removeEventListener('message', handleNodesCellMessage);
    };
  }, [isSelectedActive, largeGraphData, graphData, nodeTable, edgeTable, isFullScreen, updateContext, graph]);
};

export default useCellSelect;
