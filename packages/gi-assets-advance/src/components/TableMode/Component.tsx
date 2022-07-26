import { useContext,utils } from '@alipay/graphinsight';
import { IEdge, INode } from '@antv/g6';
import { S2DataConfig, S2Event, S2Options, SpreadSheet } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';
import useNodeDataCfg from "./useNodeDataCfg";
import useEdgeDataCfg from "./useEdgeDataCfg"

interface IState {
  nodeData: any[];
  edgeData: any[];
}

const { TabPane } = Tabs;

const TableMode = props => {
  const { isSelectedActive } = props;
  const { schemaData, data: graphData, graph, largeGraphData, updateContext, transform } = useContext();

  console.log("largeGraphData:", largeGraphData)

  const nodeS2Ref = React.useRef<SpreadSheet>(null);
  const edgeS2Ref = React.useRef<SpreadSheet>(null);
  // S2 的 options 配置
  const [options, setOptions] = React.useState<S2Options>({});
  const nodeDataCfg: S2DataConfig = useNodeDataCfg(schemaData, graphData, largeGraphData);
  const edgeDataCfg: S2DataConfig = useEdgeDataCfg(schemaData, graphData, largeGraphData);


  React.useEffect(() => {
    nodeS2Ref.current?.on(S2Event.GLOBAL_SELECTED, cells => {
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
      const selectedNodes = new Set<string>();
      cells.forEach(cell => {
        const meta = cell.getMeta();
        const rowId = parseInt(meta.rowId);
        // @ts-ignore
        const rowData = nodeS2Ref.current?.dataSet.getMultiData();
        if (!rowData) return;
        const nodeID = rowData[rowId]?.id;
        selectedNodes.add(nodeID);
      });

      console.log("selectedNodes:", selectedNodes)

      if (largeGraphData) {
        const nodes = largeGraphData.nodes.filter(n => selectedNodes.has(n.id))
        const edges = largeGraphData.edges.filter(e => selectedNodes.has(e.target) && selectedNodes.has(e.source));
        const newData = {
          nodes,
          edges,
        }
        updateContext(draft => {
          draft.data = newData;
          draft.source = newData;
        })

      } else {
        graphData.edges.forEach(edgeConfig => {
          const { id, source, target } = edgeConfig;
          //graph.setItemState(id, 'disabled', true);
          const item = graph.findById(id) as IEdge;
          if (selectedNodes.has(edgeConfig.target) && selectedNodes.has(edgeConfig.source)) {
            // 两端节点都高亮时，对应的边也高亮
            graph.setItemState(id, "selected", true);
            graph.setItemState(id, "disabled", false);
          } else {
            !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
            item.hasState('selected') && graph.setItemState(id, 'selected', false);
          }
        });
  
        graphData.nodes.forEach(nodeConfig => {
          const { id } = nodeConfig;
          const item = graph.findById(id) as INode;
          if (selectedNodes.has(id)) {
            graph.setItemState(id, 'disabled', false);
            graph.setItemState(id, 'selected', true);
          } else {
            !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
            item.hasState('selected') && graph.setItemState(id, 'selected', false);
          }
        });
      }
    });

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
      nodeS2Ref.current?.off(S2Event.GLOBAL_SELECTED);
      edgeS2Ref.current?.off(S2Event.GLOBAL_SELECTED);
    };
  }, [isSelectedActive, largeGraphData, graphData]);

  const setS2Options = () => {
    const container = document.getElementById('gi-table-mode') as HTMLDivElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    setOptions(preState => {
      return {
        ...preState,
        width,
        height,
      };
    });
  };

  // S2 table 适应父容器存在 bug，
  React.useEffect(() => {
    window.addEventListener('resize', setS2Options);
    return () => {
      window.removeEventListener('resize', setS2Options);
    };
  }, []);

  React.useLayoutEffect(() => {
    setS2Options();
  }, []);

  return (
    <div className="gi-table-mode" id="gi-table-mode">
      <Tabs tabPosition="left">
        <TabPane tab="点表" key="node">
          <SheetComponent
            ref={nodeS2Ref}
            //adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
            options={options}
            dataCfg={nodeDataCfg}
            sheetType="table"
          />
        </TabPane>
        <TabPane tab="边表" key="edge" forceRender>
          <SheetComponent
            ref={edgeS2Ref}
            //adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
            options={options}
            dataCfg={edgeDataCfg}
            sheetType="table"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TableMode;
