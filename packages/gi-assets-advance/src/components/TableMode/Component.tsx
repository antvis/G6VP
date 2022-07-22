import { useContext } from '@alipay/graphinsight';
import { IEdge, INode } from '@antv/g6';
import { S2DataConfig, S2Event, S2Options, SpreadSheet } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';

interface IState {
  nodeData: any[];
  edgeData: any[];
}

const { TabPane } = Tabs;

const TableMode = props => {
  const { isSelectedActive } = props;
  const { schemaData, data: graphData, graph } = useContext();

  const nodeS2Ref = React.useRef<SpreadSheet>(null);
  const edgeS2Ref = React.useRef<SpreadSheet>(null);

  const [options, setOptions] = React.useState<S2Options>({});

  const nodeDataCfg: S2DataConfig = React.useMemo(() => {
    const nodeProperties = schemaData.nodes.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});

    let columns: string[] = [];
    for (let key in nodeProperties) {
      if (typeof nodeProperties[key] === 'number' || typeof nodeProperties[key] === 'string') {
        columns.push(key);
      }
    }
    const data = graphData.nodes.map(node => ({ ...node.data, id: node.id }));
    return {
      fields: {
        columns,
      },
      data,
    };
  }, [schemaData, graphData]);

  const edgeDataCfg: S2DataConfig = React.useMemo(() => {
    const edgeProperties = schemaData.edges.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});

    let columns: string[] = [];
    for (let key in edgeProperties) {
      if (typeof edgeProperties[key] === 'number' || typeof edgeProperties[key] === 'string') {
        columns.push(key);
      }
    }
    const data = graphData.edges.map(edge => ({ ...edge.data, id: edge.id }));
    return {
      fields: {
        columns,
      },
      data,
    };
  }, [schemaData, graphData]);

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
      graphData.edges.forEach(edgeConfig => {
        const { id } = edgeConfig;
        graph.setItemState(id, 'disabled', true);
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
      cells.forEach(cell => {
        const meta = cell.getMeta();
        const rowId = parseInt(meta.rowId);
        // @ts-ignore
        const rowData = edgeS2Ref.current?.dataSet.getMultiData();
        if (!rowData) return;
        console.log('rowData:', rowData);
        const edgeID = rowData[rowId]?.id;
        selectedEdges.add(edgeID);
      });
      graphData.nodes.forEach(edgeConfig => {
        const { id } = edgeConfig;

        graph.setItemState(id, 'disabled', true);
      });

      graphData.edges.forEach(edgeConfig => {
        const { id } = edgeConfig;
        const item = graph.findById(id) as IEdge;

        if (selectedEdges.has(id)) {
          graph.setItemState(id, 'disabled', false);
          graph.setItemState(id, 'selected', true);
        } else {
          !item.hasState('disabled') && graph.setItemState(id, 'disabled', true);
          item.hasState('selected') && graph.setItemState(id, 'selected', false);
        }
      });
    });

    return () => {
      nodeS2Ref.current?.off(S2Event.GLOBAL_SELECTED);
      edgeS2Ref.current?.off(S2Event.GLOBAL_SELECTED);
    };
  }, [isSelectedActive]);

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
