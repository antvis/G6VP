import { GraphinData } from '@antv/graphin';
import { S2Event, SpreadSheet } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Alert, Tabs } from 'antd';
import React, { useState } from 'react';
import getData from './utils';

const { TabPane } = Tabs;
interface TableModeProps {}

const TableMode: React.FunctionComponent<TableModeProps> = props => {
  const [state, setState] = useState<{
    edgeTable: null | SpreadSheet;
    nodeTable: null | SpreadSheet;
    options: any;
    largeGraphData: GraphinData | undefined;
    graphData: GraphinData;
    selectItems: GraphinData;
    NODES_FIELDS_COLUMNS: string[];
    EDGES_FIELDS_COLUMNS: string[];
  }>({
    edgeTable: null,
    nodeTable: null,
    options: null,
    largeGraphData: undefined,
    graphData: {
      nodes: [],
      edges: [],
    },
    NODES_FIELDS_COLUMNS: [],
    EDGES_FIELDS_COLUMNS: [],
    selectItems: { nodes: [], edges: [] },
  });
  const { edgeTable, nodeTable } = state;
  const handleReset = () => {
    edgeTable?.interaction.reset();
    nodeTable?.interaction.reset();
  };
  const handleMessage = e => {
    const { payload, type } = e.data;
    /** ${Onwer}_${ComponentName}_${Action} */
    if (type == 'TABS_TABLEMODE_INIT') {
      setState(preState => {
        return {
          ...preState,
          ...payload,
        };
      });
    }
    /** ${Onwer}_${ComponentName}_${Action} */
    if (type == 'TABS_TABLEMODE_SELECT') {
      setState(preState => {
        return {
          ...preState,
          ...payload,
        };
      });
    }
    if (type === 'TABS_TABLEMODE_CLEAR') {
      handleReset();
    }
  };
  React.useEffect(() => {
    window.opener.postMessage({
      /** ${Onwer}_${ComponentName}_${Action} */
      type: 'GI_TABLEMODE_READY',
      payload: {
        isReady: true,
      },
    });
  }, []);

  React.useEffect(() => {
    if (nodeTable) {
      /** 圈选点表 */
      nodeTable.on(S2Event.GLOBAL_SELECTED, () => {
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

        window.opener.postMessage({
          /** ${Onwer}_${ComponentName}_${Action} */
          type: 'GI_TABLEMODE_SELECT',
          payload: {
            selectedNodes,
          },
        });
      });
    }
    console.log('edgeTable', edgeTable);
    if (edgeTable) {
      /** 圈选边表 */
      edgeTable.on(S2Event.GLOBAL_SELECTED, () => {
        debugger;
        const cells = edgeTable.interaction.getCells();
        const selectedEdges = new Set<string>();
        cells.forEach(cell => {
          const { rowIndex } = cell;
          // @ts-ignore
          const rowData = edgeTable.dataSet.getMultiData();
          if (!rowData) return;
          const nodeID = rowData[rowIndex]?.id;
          selectedEdges.add(nodeID);
        });

        window.opener.postMessage({
          type: 'GI_TABLEMODE_SELECT',
          payload: {
            selectedEdges,
          },
        });
      });
    }
    const containerBar = document.querySelector('.ant-tabs-nav-wrap');

    if (containerBar) {
      containerBar.addEventListener('click', handleReset);
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      edgeTable?.off(S2Event.GLOBAL_SELECTED);
      nodeTable?.off(S2Event.GLOBAL_SELECTED);
      containerBar?.removeEventListener('click', handleReset);
    };
  }, [edgeTable, nodeTable]);

  const { options, selectItems, largeGraphData, graphData, NODES_FIELDS_COLUMNS, EDGES_FIELDS_COLUMNS } = state;

  const NODES_DATA = getData('nodes', { selectItems, largeGraphData, graphData });
  const EDGES_DATA = getData('edges', { selectItems, largeGraphData, graphData });

  if (!options) {
    return null;
  }

  return (
    <>
      <Alert
        message="当前版本只支持从表格到画布的交互，从画布到表格的交互下个版本上线。您可以利用浏览器特性，分屏展示，操作更加高效。"
        type="info"
        showIcon
      />
      <Tabs tabPosition="top" destroyInactiveTabPane centered style={{ height: '100%', width: '100%' }}>
        <TabPane tab="点表" key="node" style={{ height: '100%' }}>
          <div style={{ height: 'calc(100vh - 60px)' }}>
            <SheetComponent
              getSpreadSheet={s2 => {
                setState(preState => {
                  return {
                    ...preState,
                    nodeTable: s2,
                  };
                });
                // 处理你的业务逻辑
              }}
              adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
              options={options}
              dataCfg={{
                fields: {
                  columns: NODES_FIELDS_COLUMNS,
                },
                data: NODES_DATA,
              }}
              sheetType="table"
            />
          </div>
        </TabPane>
        <TabPane tab="边表" key="edge">
          <div style={{ height: 'calc(100vh - 60px)' }}>
            <SheetComponent
              getSpreadSheet={s2 => {
                setState(preState => {
                  return {
                    ...preState,
                    edgeTable: s2,
                  };
                });
                // 处理你的业务逻辑
              }}
              adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
              options={options}
              dataCfg={{
                fields: {
                  columns: EDGES_FIELDS_COLUMNS,
                },
                data: EDGES_DATA,
              }}
              sheetType="table"
            />
          </div>
        </TabPane>
      </Tabs>
    </>
  );
};

export default TableMode;
