import { Compatible, useContext, utils } from '@antv/gi-sdk';
import { Skeleton } from 'antd';
import React, { memo } from 'react';
import DivContainer from '../UIComponents/DivContainer';
import Properties from './Properties';

export interface PropertiesPanelProps {
  hasService: boolean;
  serviceId?: string;
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  width: string;
  height: string;
  title: string;
  offset: number[];
  defaultiStatistic: boolean;
  enableInfoDetect: boolean;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const PropertiesPanel: React.FunctionComponent<PropertiesPanelProps> = props => {
  const { serviceId, placement, width, title, height, offset, defaultiStatistic, enableInfoDetect } = props;
  const { graph, services, context } = useContext<{ propertyGraphData: any }>();
  const { propertyGraphData, data } = context;
  const service = utils.getService(services, serviceId);
  if (!service) {
    return null;
  }

  const [state, setState] = React.useState({
    visible: false,
    detail: null,
    isLoading: false,
    propertyInfos: [] as { propertyName: string; ratio: number }[],
  });

  const handleClose = () => {
    setState(preState => {
      if (preState.visible) {
        return {
          visible: false,
          isLoading: false,
          detail: null,
          propertyInfos: [],
        };
      }
      return preState;
    });
  };

  React.useLayoutEffect(() => {
    const handleNodeClick = async e => {
      setState(preState => {
        return {
          ...preState,
          visible: true,
          isLoading: true,
        };
      });
      Compatible.item(e, graph);
      const model = e.item.getModel();
      // 有数据服务就从服务中取数，没有服务就从Model中取数
      const detail = await service({ ...model, type: 'node' });

      let propertyInfos: { propertyName: string; ratio: number }[] = [];
      if (enableInfoDetect) {
        propertyInfos = utils.getNodePropertyImportance(propertyGraphData, 'node', detail.id, 3, true);
      }

      setState(preState => {
        return {
          ...preState,
          detail,
          propertyInfos,
          isLoading: false,
        };
      });
    };
    const handleEdgeClick = async e => {
      setState(preState => {
        return {
          ...preState,
          visible: true,
          isLoading: true,
        };
      });
      Compatible.item(e, graph);
      const model = e.item.getModel();
      // 有数据服务就从服务中取数，没有服务就从Model中取数
      const detail = await service({ ...model, type: 'edge' });

      let propertyInfos: { propertyName: string; ratio: number; rank: number; isOuterlier?: boolean }[] = [];
      if (enableInfoDetect) {
        propertyInfos = utils.getNodePropertyImportance(propertyGraphData, 'edge', detail.id, 3, true);
      }

      setState(preState => {
        return {
          ...preState,
          detail,
          propertyInfos,
          isLoading: false,
        };
      });
    };

    graph.on('node:click', handleNodeClick);
    graph.on('edge:click', handleEdgeClick);
    graph.on('canvas:click', handleClose);
    return () => {
      graph.off('node:click', handleNodeClick);
      graph.off('canvas:click', handleClose);
      graph.off('edge:click', handleEdgeClick);
    };
  }, [graph, setState, service, propertyGraphData]);
  const { isLoading, detail, propertyInfos, visible } = state;

  const content =
    !isLoading && detail ? (
      <Properties data={detail} defaultiStatistic={defaultiStatistic} propertyInfos={propertyInfos} />
    ) : (
      <Skeleton active />
    );

  return (
    <DivContainer
      animate={true}
      title={title}
      visible={visible}
      containerPlacement={placement}
      containerWidth={width}
      containerHeight={height}
      onClose={handleClose}
      offset={offset}
    >
      {content}
    </DivContainer>
  );
};

export default memo(PropertiesPanel);
