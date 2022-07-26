import React from 'react';
import { IEdge, INode } from '@antv/g6';
import { S2Event } from '@antv/s2';

import { useContext } from '@alipay/graphinsight';
const useListenEdgeSelect = (isSelectedActive, edgeS2Ref) => {
  const { data: graphData, graph, largeGraphData, updateContext } = useContext();
  React.useEffect(() => {
   
    edgeS2Ref.current?.on(S2Event.GLOBAL_SELECTED, cells => {
        // isSelectedActiv 为 false 时，不高亮选中元素
        if (!isSelectedActive) {
          return;
        }
  
        if (cells.length === 0) {
          graphData.nodes.forEach(node => {
            graph.clearItemStates(node.id);
          });
          graphData.edges.forEach(edge => {
            graph.clearItemStates(edge.id);
          });
          return;
        }
        const selectedEdges = new Set<string>();
        // 与选中边相连的节点
        const relatedNodes = new Set<string>();
  
        cells.forEach(cell => {
          const meta = cell.getMeta();
          const rowId = parseInt(meta.rowId);
          // @ts-ignore
          const rowData = edgeS2Ref.current?.dataSet.getMultiData();
          if (!rowData) return;
          const edgeID = rowData[rowId]?.id;
          selectedEdges.add(edgeID);
        });
  
        
  
        console.log("selectedEdges: ", selectedEdges)
        if (largeGraphData) {
          
          const edges = largeGraphData.edges.filter(e => {
            //console.log("id:", e.id)
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
          }
          //console.log("newData:", newData)
          updateContext(draft => {
            draft.source = newData;
            draft.data = newData;
          })
  
        } else {
          graphData.edges.forEach(edgeConfig => {
            const { id } = edgeConfig;
            const item = graph.findById(id) as IEdge;
    
            if (selectedEdges.has(id)) {
              graph.setItemState(id, 'disabled', false);
              graph.setItemState(id, 'selected', true);
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
              graph.setItemState(id, 'disabled', false);
              graph.setItemState(id, 'selected', true);
            } else {
              !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
              item.hasState('selected') && graph.setItemState(id, 'selected', false);
            }
          });
        }
      });

    return () => {
        edgeS2Ref.current?.off(S2Event.GLOBAL_SELECTED);
    }
  }, [isSelectedActive, largeGraphData, graphData, edgeS2Ref]);
};

export default useListenEdgeSelect;