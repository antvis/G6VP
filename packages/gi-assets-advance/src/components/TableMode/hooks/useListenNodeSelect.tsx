import { S2Event, SpreadSheet } from '@antv/s2';
import React from 'react';
type IEdge = any;
type INode = any;

import { useContext } from '@antv/gi-sdk';

const useListenNodeSelect = (isSelectedActive: boolean, s2Instance: SpreadSheet | null, isFullScreen: boolean) => {
  const { graph, updateContext, context } = useContext();
  const { data: graphData, largeGraphData } = context;
  React.useEffect(() => {
    s2Instance?.on(S2Event.GLOBAL_SELECTED, () => {
      // isSelectedActiv 为 false 或全屏时，不高亮选中元素
      if (!isSelectedActive || isFullScreen) {
        return;
      }
      const cells = s2Instance.interaction.getCells();
      // if (cells.length === 0) {
      //   graphData.nodes.forEach(node => {
      //     graph.clearItemStates(node.id);
      //   });
      //   graphData.edges.forEach(edge => {
      //     graph.clearItemStates(edge.id);
      //   });
      //   return;
      // }
      const selectedNodes = new Set<string>();

      cells.forEach(cell => {
        const { rowIndex } = cell;
        // @ts-ignore
        const rowData = s2Instance.dataSet.getMultiData();
        if (!rowData) return;
        const nodeID = rowData[rowIndex]?.id;
        // @ts-ignore
        selectedNodes.add(nodeID);
      });

      if (largeGraphData) {
        const nodes = largeGraphData.nodes.filter(n => selectedNodes.has(n.id));
        const edges = largeGraphData.edges.filter(e => selectedNodes.has(e.target) && selectedNodes.has(e.source));
        const newData = {
          nodes,
          edges,
        };
        updateContext(draft => {
          draft.data = newData;
          draft.source = newData;
        });
      } else {
        graphData.nodes.forEach(nodeConfig => {
          const { id } = nodeConfig;
          const item = graph.findById(id) as INode;
          if (selectedNodes.has(id)) {
            item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
            !item.hasState('selected') && graph.setItemState(id, 'selected', true);
          } else {
            !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
            item.hasState('selected') && graph.setItemState(id, 'selected', false);
          }
        });

        graphData.edges.forEach(edgeConfig => {
          const { id, source, target } = edgeConfig;
          graph.setItemState(id, 'disabled', true);
          const item = graph.findById(id) as IEdge;
          if (selectedNodes.has(target) && selectedNodes.has(source)) {
            // 两端节点都高亮时，对应的边也高亮
            !item.hasState('selected') && graph.setItemState(id, 'selected', true);
            item.hasState('disabled') && graph.setItemState(id, 'disabled', false);
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

export default useListenNodeSelect;
