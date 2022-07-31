import { useContext } from '@alipay/graphinsight';
import { S2DataConfig, S2Options, SpreadSheet } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Tabs } from 'antd';
import React from 'react';
import './index.less';
import useNodeDataCfg from "./hooks/useNodeDataCfg";
import useEdgeDataCfg from "./hooks/useEdgeDataCfg";
import useListenNodeSelect from "./hooks/useListenNodeSelect";
import useListenEdgeSelect from "./hooks/useListenEdgeSelect";


export interface IProps {
  isSelectedActive: boolean;
  containerHeight?: string;

}

const { TabPane } = Tabs;

const TableMode:React.FC<IProps> = props => {
  const { isSelectedActive, containerHeight } = props;
  const { schemaData, data: graphData, graph, largeGraphData } = useContext();

  const nodeS2Ref = React.useRef<SpreadSheet>(null);
  const edgeS2Ref = React.useRef<SpreadSheet>(null);

  //nodeS2Ref.current?.interaction.setState()
  // S2 的 options 配置
  const [options, setOptions] = React.useState<S2Options>({
    showSeriesNumber: true,
    interaction: {
      autoResetSheetStyle: false
    }
  });
  const nodeDataCfg: S2DataConfig = useNodeDataCfg(schemaData, graphData, largeGraphData);
  const edgeDataCfg: S2DataConfig = useEdgeDataCfg(schemaData, graphData, largeGraphData);

  useListenNodeSelect(isSelectedActive, nodeS2Ref.current);
  useListenEdgeSelect(isSelectedActive, edgeS2Ref.current);

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


  React.useEffect(() => {
    const reset = () => {
      nodeS2Ref.current?.interaction.reset();
      edgeS2Ref.current?.interaction.reset();
    }
    graph.on("canvas:click", reset);

    return () => {
      graph.off("canvas:click", reset);
    }
  }, [nodeS2Ref, edgeS2Ref])
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

  return (
    <div className="gi-table-mode" id="gi-table-mode">
      <Tabs tabPosition="top" tabBarExtraContent={<div>11111</div>}>
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