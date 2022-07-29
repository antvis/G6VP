import React from 'react';
import { IEdge, INode } from '@antv/g6';
import { S2Event } from '@antv/s2';

import { useContext } from '@alipay/graphinsight';
const useListenNodeSelect = (isSelectedActive, nodeS2Ref) => {
  const { data: graphData, graph, largeGraphData, updateContext } = useContext();
  React.useEffect(() => {
    
    nodeS2Ref.current?.on(S2Event.GLOBAL_SELECTED, () => {
      // isSelectedActiv 为 false 时，不高亮选中元素
      if (!isSelectedActive) {
        return;
      }
      const cells = nodeS2Ref.current.interaction.getCells();
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

      console.log("cells:", cells)
      cells.forEach(cell => {
        const { rowIndex } = cell;
        // @ts-ignore
        const rowData = nodeS2Ref.current?.dataSet.getMultiData();
        if (!rowData) return;
        const nodeID = rowData[rowIndex]?.id;
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
             !item.hasState("selected") && graph.setItemState(id, 'selected', true);
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
             !item.hasState("selected") && graph.setItemState(id, 'selected', true);
             item.hasState("disabled") && graph.setItemState(id, 'disabled', false);
           } else {
             !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
             item.hasState('selected') && graph.setItemState(id, 'selected', false);
           }
        });
      }
    });

    return () => {
        nodeS2Ref.current?.off(S2Event.GLOBAL_SELECTED);
    }
  }, [isSelectedActive, largeGraphData, graphData, nodeS2Ref]);
};

export default useListenNodeSelect;