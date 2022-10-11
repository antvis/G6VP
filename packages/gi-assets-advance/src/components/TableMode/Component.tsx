import { useContext } from '@alipay/graphinsight';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { S2DataConfig } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Button, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useFullScreen, useListenEdgeSelect, useListenNodeSelect } from './hooks';
import './index.less';
import getColumns from './utils/getColumns';
import getData from './utils/getData';

export interface IProps {
  isSelectedActive: boolean;
  enableCopy: boolean;
  containerHeight?: string;
  style?: React.CSSProperties;
}

const { TabPane } = Tabs;

const TableMode: React.FC<IProps> = props => {
  const { isSelectedActive, enableCopy, style = {} } = props;
  const { graph, schemaData, largeGraphData, data: graphData } = useContext();
  const isFullScreen = useFullScreen();

  // S2 的 options 配置
  const [options, updateOptions] = useImmer<any>({
    supportCSSTransform: true,
    showSeriesNumber: true,
    interaction: {
      autoResetSheetStyle: false,
    },
    tooltip: {},
  });

  const [s2Instance, updateS2Instance] = useImmer<{ nodeTable: any; edgeTable: any }>({
    nodeTable: null,
    edgeTable: null,
  });

  const [selectItems, setSelectItems] = React.useState<GraphinData>({
    nodes: [],
    edges: [],
  });

  const NODES_FIELDS_COLUMNS = getColumns(schemaData, 'nodes');
  const EDGES_FIELDS_COLUMNS = getColumns(schemaData, 'edges');
  const NODES_DATA = getData('nodes', { selectItems, largeGraphData, graphData });
  const EDGES_DATA = getData('edges', { selectItems, largeGraphData, graphData });

  const nodeDataCfg: S2DataConfig = {
    fields: {
      columns: NODES_FIELDS_COLUMNS,
    },
    data: NODES_DATA,
  }; //useNodeDataCfg();
  const edgeDataCfg: S2DataConfig = {
    fields: {
      columns: EDGES_FIELDS_COLUMNS,
    },
    data: EDGES_DATA,
  }; //useEdgeDataCfg();

  useListenNodeSelect(isSelectedActive, s2Instance.nodeTable, isFullScreen);
  useListenEdgeSelect(isSelectedActive, s2Instance.edgeTable, isFullScreen);

  React.useEffect(() => {
    const reset = () => {
      s2Instance.nodeTable?.interaction.reset();
      s2Instance.edgeTable?.interaction.reset();
      if (selectItems.nodes.length !== 0) {
        setSelectItems({
          nodes: [],
          edges: [],
        });
      }
    };
    graph.on('canvas:click', reset);

    return () => {
      graph.off('canvas:click', reset);
    };
  }, [s2Instance.nodeTable, s2Instance.edgeTable, selectItems]);

  React.useEffect(() => {
    graph.on('nodeselectchange', e => {
      const { selectedItems, select } = e;
      if (!select) {
        return;
      }
      //@ts-ignore
      const { nodes, edges } = selectedItems;
      const res = edges.reduce((acc, curr) => {
        const model = curr.getModel();
        if (model.aggregate) {
          return [...acc, ...model.aggregate];
        }
        return [...acc, model];
      }, []);

      setSelectItems({
        nodes: nodes.map(c => c.getModel()),
        edges: res,
      });
    });
    graph.on('edge:click', e => {
      if (!e.item) {
        return;
      }
      const model = e.item.getModel();
      //@ts-ignore
      setSelectItems(preState => {
        return {
          ...preState,
          edges: model.aggregate ? model.aggregate : [model],
        };
      });
    });
  }, [setSelectItems]);

  const toggleFullScreen = () => {
    const container = document.getElementById('gi-table-mode') as HTMLDivElement;
    if (!isFullScreen) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const extra = (
    <Button
      type="text"
      icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      onClick={toggleFullScreen}
    />
  );

  useEffect(() => {
    updateOptions(draft => {
      draft.interaction!.enableCopy = enableCopy;
      //@ts-ignore
      draft.interaction!.copyWithHeader = enableCopy;
    });
  }, [enableCopy]);

  useEffect(() => {
    // 避免全屏状态下 tooltip 不显示
    updateOptions(draft => {
      const tooltipContainer = document.getElementById('gi-table-mode') as HTMLDivElement;
      draft.tooltip!.getContainer = () => tooltipContainer;
    });
  }, []);
  /* 
    todo：
    s2 copy 事件的触发对象是 body，所以必须监听事件必须绑定在在body及其父元素上才能触发
    但是这样的话会导致其他地方的 copy 也触发这一事件
  */
  // useEffect(() => {
  //   const copyListen = (e) => {
  //     console.log("e:", e)
  //     message.success('表格选择内容已复制到剪切板');
  //   };
  //   const element = document.getElementById('gi-table-mode') as HTMLDivElement;
  //   window.addEventListener('copy', copyListen);
  //   return () => {
  //     element.removeEventListener('copy', copyListen);
  //   };
  // }, []);

  return (
    <div className="gi-table-mode" id="gi-table-mode" style={style}>
      <Tabs tabPosition="top" tabBarExtraContent={extra} destroyInactiveTabPane centered>
        <TabPane tab="点表" key="node">
          <SheetComponent
            getSpreadSheet={s2 => {
              updateS2Instance(draft => {
                draft.nodeTable = s2;
              });
              // 处理你的业务逻辑
            }}
            adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
            options={options}
            dataCfg={nodeDataCfg}
            sheetType="table"
          />
        </TabPane>
        <TabPane tab="边表" key="edge">
          <SheetComponent
            getSpreadSheet={s2 => {
              updateS2Instance(draft => {
                draft.edgeTable = s2;
              });
              // 处理你的业务逻辑
            }}
            adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
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
