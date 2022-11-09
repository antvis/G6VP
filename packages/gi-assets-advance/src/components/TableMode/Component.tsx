import { ChromeOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import { generatePalette, getPalette, S2DataConfig } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Button, Tabs, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useFullScreen } from './hooks';
import useCellSelect from './hooks/useCellSelect';
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
  const targetWindowRef = React.useRef<null | Window>(null);

  // 使用内置的 colorful 色板作为参考色板
  const palette = getPalette('colorful');
  // 使用参考色板 & 主题色值生成新色板
  const newPalette = generatePalette({
    ...palette,
    brandColor: localStorage.getItem('@theme') === 'dark' ? '#1f1f1f' : '#3056e3',
  });
  const themeCfg = {
    name: 'colorful',
    palette: newPalette,
  };

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
  const [state, setState] = React.useState({
    isPostStart: false,
    postParmas: {},
  });
  const { isPostStart, postParmas } = state;

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

  // useListenNodeSelect(isSelectedActive, s2Instance.nodeTable, isFullScreen);
  // useListenEdgeSelect(isSelectedActive, s2Instance.edgeTable, isFullScreen);
  useCellSelect(isSelectedActive, s2Instance, isFullScreen);

  React.useEffect(() => {
    const reset = () => {
      s2Instance.nodeTable?.interaction.reset();
      s2Instance.edgeTable?.interaction.reset();
      targetWindowRef.current?.postMessage({
        /** ${Onwer}_${ComponentName}_${Action} */
        type: 'TABS_TABLEMODE_CLEAR',
        payload: {},
      });

      if (selectItems.nodes.length !== 0 || selectItems.edges.length !== 0) {
        targetWindowRef.current?.postMessage({
          /** ${Onwer}_${ComponentName}_${Action} */
          type: 'TABS_TABLEMODE_SELECT',
          payload: {
            selectItems: {
              nodes: [],
              edges: [],
            },
          },
        });
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

  /** 从画布到表格的交互逻辑 */
  React.useEffect(() => {
    graph.on('nodeselectchange', e => {
      const { selectedItems, select } = e;
      if (!select) {
        return;
      }
      //@ts-ignore
      const { nodes, edges } = selectedItems;
      const resEdges = edges.reduce((acc, curr) => {
        const model = curr.getModel();
        if (model.aggregate) {
          return [...acc, ...model.aggregate];
        }
        return [...acc, model];
      }, []);
      const res = {
        nodes: nodes.map(c => c.getModel()),
        edges: resEdges,
      };

      targetWindowRef.current?.postMessage({
        /** ${Onwer}_${ComponentName}_${Action} */
        type: 'TABS_TABLEMODE_SELECT',
        payload: {
          selectItems: res,
        },
      });
      setSelectItems(res);
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

      targetWindowRef.current?.postMessage({
        /** ${Onwer}_${ComponentName}_${Action} */
        type: 'TABS_TABLEMODE_SELECT',
        payload: {
          selectItems: {
            nodes: [],
            edges: model.aggregate ? model.aggregate : [model],
          },
        },
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

  const handleOpen = () => {
    const params = {
      // dataCfg: {
      //   nodeDataCfg,
      //   edgeDataCfg,
      // },
      options: {
        supportCSSTransform: true,
        showSeriesNumber: true,
        interaction: {
          autoResetSheetStyle: false,
        },
      },
      largeGraphData,
      graphData,
      NODES_FIELDS_COLUMNS,
      EDGES_FIELDS_COLUMNS,
    };
    setState({ isPostStart: true, postParmas: params });
  };
  React.useEffect(() => {
    if (!isPostStart) {
      return;
    }
    const targetOrigin = window.location.origin + '/#/tabs/table';

    const targetWindow = window.open(window.location.origin + '/#/tabs/table', '_black');
    targetWindowRef.current = targetWindow;
    const handleMessage = e => {
      if (e.data.type === 'GI_TABLEMODE_READY' && e.data.payload.isReady) {
        targetWindow?.postMessage(
          {
            type: 'TABS_TABLEMODE_INIT', //  /** ${Onwer}_${ComponentName}_${Action} */
            payload: postParmas,
          },
          targetOrigin,
        );
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isPostStart, postParmas]);
  const extra = (
    <>
      <Button
        type="text"
        icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        onClick={toggleFullScreen}
      />
      <Tooltip title="使用浏览器新页签打开，分屏操作更高效">
        <Button type="text" icon={<ChromeOutlined />} onClick={handleOpen} />
      </Tooltip>
    </>
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
            //@ts-ignore
            themeCfg={themeCfg}
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
            //@ts-ignore
            themeCfg={themeCfg}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TableMode;
