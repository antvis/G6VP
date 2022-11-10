import { IEdge, INode } from '@antv/g6';
import { S2Event, SpreadSheet } from '@antv/s2';
import React from 'react';

import { useContext } from '@antv/gi-sdk';
const useListenEdgeSelect = (isSelectedActive: boolean, s2Instance: SpreadSheet | null, isFullScreen: boolean) => {
  const { data: graphData, graph, largeGraphData, updateContext } = useContext();
  React.useEffect(() => {
    s2Instance?.on(S2Event.GLOBAL_SELECTED, () => {
      // isSelectedActiv 为 false 或全屏时，不高亮选中元素
      if (!isSelectedActive || isFullScreen) {
        return;
      }

      const cells = s2Instance.interaction.getCells();
      console.log('cells:', cells);

      // if (cells.length === 0) {
      //   graphData.nodes.forEach(node => {
      //     graph.clearItemStates(node.id);
      //   });
      //   graphData.edges.forEach(edge => {
      //     graph.clearItemStates(edge.id);
      //   });
      //   return;
      // }
      const selectedEdges = new Set<string>();
      // 与选中边相连的节点
      const relatedNodes = new Set<string>();

      cells.forEach(cell => {
        const { rowIndex } = cell;
        // @ts-ignore
        const rowData = s2Instance.dataSet.getMultiData();
        if (!rowData) return;
        const nodeID = rowData[rowIndex]?.id;
        selectedEdges.add(nodeID);
      });

      if (largeGraphData) {
        const edges = largeGraphData.edges.filter(e => {
          if (selectedEdges.has(e.id)) {
            relatedNodes.add(e.target);
            relatedNodes.add(e.source);
            return true;
          }
          return false;
        });

        const nodes = largeGraphData.nodes.filter(n => relatedNodes.has(n.id));

        const newData = {
          nodes,
          edges,
        };
        //console.log("newData:", newData)
        updateContext(draft => {
          draft.source = newData;
          draft.data = newData;
        });
      } else {
        graphData.edges.forEach(edgeConfig => {
          const { id } = edgeConfig;
          const item = graph.findById(id) as IEdge;

          if (selectedEdges.has(id)) {
            item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
            !item.hasState('selected') && graph.setItemState(id, 'selected', true);
            relatedNodes.add(edgeConfig.target);
            relatedNodes.add(edgeConfig.source);
          } else {
            !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
            item.hasState('selected') && graph.setItemState(id, 'selected', false);
          }
        });

        graphData.nodes.forEach(nodeConfig => {
          const { id } = nodeConfig;
          const item = graph.findById(id) as INode;
          //graph.setItemState(id, 'disabled', true);
          if (relatedNodes.has(id)) {
            // 与高亮节点相连的边也要高亮
            item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
            !item.hasState('selected') && graph.setItemState(id, 'selected', true);
          } else {
            !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
            item.hasState('selected') && graph.setItemState(id, 'selected', false);
          }
        });
      }
    });

    return () => {
      s2Instance?.off(S2Event.GLOBAL_SELECTED);
    };
  }, [isSelectedActive, largeGraphData, graphData, s2Instance, isFullScreen]);
};

export default useListenEdgeSelect;
