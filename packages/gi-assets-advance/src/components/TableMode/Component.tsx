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
  const { isSelectedActive, containerHeight, enableCopy } = props;
  const { schemaData, data: graphData, graph, largeGraphData } = useContext();
  const isFullScreen = useFullScreen();

  const nodeS2Ref = React.useRef<SpreadSheet>(null);
  const edgeS2Ref = React.useRef<SpreadSheet>(null);

  // S2 的 options 配置
  const [options, updateOptions] = useImmer<S2Options>({
    showSeriesNumber: true,
    interaction: {
      autoResetSheetStyle: false,
    },
  });

  const nodeDataCfg: S2DataConfig = useNodeDataCfg(schemaData, graphData, largeGraphData);
  const edgeDataCfg: S2DataConfig = useEdgeDataCfg(schemaData, graphData, largeGraphData);

  useListenNodeSelect(isSelectedActive, nodeS2Ref.current, isFullScreen);
  useListenEdgeSelect(isSelectedActive, edgeS2Ref.current, isFullScreen);

  const setS2Options = () => {
    const container = document.getElementById('gi-table-mode') as HTMLDivElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    // sOptions(preState => {
    //   return {
    //     ...preState,
    //     width,
    //     height,
    //   };
    // });
    updateOptions(draft => {
      draft.width = width;
      draft.height = height;
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

  React.useEffect(() => {
    const reset = () => {
      nodeS2Ref.current?.interaction.reset();
      edgeS2Ref.current?.interaction.reset();
    };
    graph.on('canvas:click', reset);

    return () => {
      graph.off('canvas:click', reset);
    };
  }, [nodeS2Ref, edgeS2Ref]);
  // React.useEffect(() => {
  //   if (containerHeight) {
  //     setOptions(preState => {
  //       return {
  //         ...preState,
  //         // 去掉像素单位：如 400px -> 400
  //         height: Number(containerHeight.slice(0, containerHeight.length - 2)),
  //       };
  //     });
  //   }
  // }, [containerHeight])
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
      <Tabs tabPosition="top" tabBarExtraContent={extra}>
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
