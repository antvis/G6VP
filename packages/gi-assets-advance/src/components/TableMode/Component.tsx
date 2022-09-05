import { useContext } from '@alipay/graphinsight';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { S2DataConfig, S2Options, SpreadSheet } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Button, Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useEdgeDataCfg, useFullScreen, useListenEdgeSelect, useListenNodeSelect, useNodeDataCfg } from './hooks';
import './index.less';

export interface IProps {
  isSelectedActive: boolean;
  enableCopy: boolean;
  containerHeight?: string;
}

const { TabPane } = Tabs;

const TableMode: React.FC<IProps> = props => {
  const { isSelectedActive, enableCopy } = props;
  const { graph } = useContext();
  const isFullScreen = useFullScreen();

  // S2 的 options 配置
  const [options, updateOptions] = useImmer<any>({
    showSeriesNumber: true,
    interaction: {
      autoResetSheetStyle: false,
    },
    tooltip: {},
  });

  const [s2Instance, updateS2Instance] = useImmer<{ nodeTable: any; edgeTable:any }>({
    nodeTable: null,
    edgeTable: null,
  });

  const nodeDataCfg: S2DataConfig = useNodeDataCfg();
  const edgeDataCfg: S2DataConfig = useEdgeDataCfg();

  useListenNodeSelect(isSelectedActive, s2Instance.nodeTable, isFullScreen);
  useListenEdgeSelect(isSelectedActive, s2Instance.edgeTable, isFullScreen);
  
  React.useEffect(() => {
    const reset = () => {
      s2Instance.nodeTable?.interaction.reset();
      s2Instance.edgeTable?.interaction.reset();
    };
    graph.on('canvas:click', reset);

    return () => {
      graph.off('canvas:click', reset);
    };
  }, [s2Instance.nodeTable, s2Instance.edgeTable]);

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
    <div className="gi-table-mode" id="gi-table-mode">
      <Tabs tabPosition="top" tabBarExtraContent={extra} destroyInactiveTabPane>
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
