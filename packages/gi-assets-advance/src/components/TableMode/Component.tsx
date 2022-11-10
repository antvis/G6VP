import { useContext } from '@alipay/graphinsight';
import { ChromeOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { S2DataConfig } from '@antv/s2';
import { SheetComponent, Switcher } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Button, Tabs, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useFullScreen } from './hooks';
import useCellSelect from './hooks/useCellSelect';
import useSwitcher from './hooks/useSwitcher';
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
const preS2Container = {
  width: 0,
  height: 0,
};
const INTIAL_NUMBER = 9527;

const TableMode: React.FC<IProps> = props => {
  const { isSelectedActive, enableCopy, style = {} } = props;
  const { graph, schemaData, largeGraphData, data: graphData } = useContext();
  const isFullScreen = useFullScreen();
  const targetWindowRef = React.useRef<null | Window>(null);

  // S2 的 options 配置
  const [options, updateOptions] = useImmer<any>({
    supportCSSTransform: true,
    showSeriesNumber: true,
    interaction: {
      autoResetSheetStyle: false,
    },
    tooltip: {},
    refreshIndex: INTIAL_NUMBER,
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

  const NODES_FIELDS_COLUMNS = React.useMemo(() => {
    return getColumns(schemaData, 'nodes');
  }, [schemaData]);

  const EDGES_FIELDS_COLUMNS = React.useMemo(() => {
    return getColumns(schemaData, 'edges');
  }, [schemaData]);

  const NODES_DATA = getData('nodes', { selectItems, largeGraphData, graphData });
  const EDGES_DATA = getData('edges', { selectItems, largeGraphData, graphData });

  const {
    fields: fields_NODES,
    switcherFields: switcherFields_NODES,

    onSwitch: onSwitch_NODES,
  } = useSwitcher({
    columns: NODES_FIELDS_COLUMNS,
  });
  const {
    fields: fields_EDGES,
    switcherFields: switcherFields_EDGES,

    onSwitch: onSwitch_EDGES,
  } = useSwitcher({
    columns: EDGES_FIELDS_COLUMNS,
  });

  const nodeDataCfg: S2DataConfig = {
    fields: fields_NODES,
    data: NODES_DATA,
  }; //useNodeDataCfg();
  const edgeDataCfg: S2DataConfig = {
    fields: fields_EDGES,
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

  console.log('RENDE>>>>>>>');
  useEffect(() => {
    updateOptions(draft => {
      draft.interaction!.enableCopy = enableCopy;
      //@ts-ignore
      draft.interaction!.copyWithHeader = enableCopy;
    });
  }, [enableCopy]);

  useEffect(() => {
    // 避免全屏状态下 tooltip 不显示
    const tooltipContainer = document.getElementById('gi-table-mode') as HTMLDivElement;
    const width = tooltipContainer.clientWidth;
    const height = tooltipContainer.clientHeight;
    console.log(options.refreshIndex, width, height);
    if (options.refreshIndex === INTIAL_NUMBER) {
      updateOptions(draft => {
        draft.tooltip!.getContainer = () => tooltipContainer;
        if (width === 0 || height === 0) {
          // 新开页签就有这个bug，找不到dom，先用这个方案解决
          draft.refreshIndex = Math.random();
        } else {
          draft.width = width;
          draft.height = height;
          preS2Container.width = width;
          preS2Container.height = height;
        }
      });
    } else {
      updateOptions(draft => {
        draft.width = preS2Container.width;
        draft.height = preS2Container.height;
      });
    }
  }, [options.refreshIndex]);
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
  const SwitcherTitle = (
    <Button size="small" style={{ position: 'absolute', right: '77px', top: '-51px' }}>
      自定义列
    </Button>
  );
  return (
    <div className="gi-table-mode" id="gi-table-mode" style={style}>
      <Tabs tabPosition="top" tabBarExtraContent={extra} destroyInactiveTabPane centered>
        <TabPane tab="点表" key="node">
          <Switcher
            sheetType="table"
            {...switcherFields_NODES}
            onSubmit={onSwitch_NODES}
            contentTitleText="自定义列"
            title={SwitcherTitle}
          />
          <SheetComponent
            getSpreadSheet={s2 => {
              updateS2Instance(draft => {
                draft.nodeTable = s2;
              });
              // 处理你的业务逻辑
            }}
            adaptive={false}
            // adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
            options={options}
            dataCfg={nodeDataCfg}
            sheetType="table"
          />
        </TabPane>
        <TabPane tab="边表" key="edge">
          <Switcher
            sheetType="table"
            {...switcherFields_EDGES}
            onSubmit={onSwitch_EDGES}
            contentTitleText="自定义列"
            title={SwitcherTitle}
          />
          <SheetComponent
            getSpreadSheet={s2 => {
              updateS2Instance(draft => {
                draft.edgeTable = s2;
              });
              // 处理你的业务逻辑
            }}
            // adaptive={{ width: true, height: true, getContainer: () => document.getElementById('gi-table-mode')! }}
            adaptive={false}
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
