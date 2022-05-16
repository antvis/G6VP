import { useContext, utils } from '@alipay/graphinsight';
import { Drawer, Skeleton } from 'antd';
import React from 'react';
import Properties from './Properties';

export interface PropertiesPanelProps {
  hasService: boolean;
  serviceId?: string;
  placement: 'top' | 'right' | 'top' | 'bottom';
  width: number;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const PropertiesPanel: React.FunctionComponent<PropertiesPanelProps> = props => {
  const { serviceId, hasService, placement, width } = props;
  const { graph, services, GISDK_ID } = useContext();
  const service = utils.getService(services, serviceId);
  if (!service) {
    return null;
  }

  const [state, setState] = React.useState({
    visible: false,
    detail: null,
    isLoading: false,
  });
  const handleClose = () => {
    setState(preState => {
      if (preState.visible) {
        return {
          visible: false,
          isLoading: false,
          detail: null,
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

      const model = e.item.getModel();
      // 有数据服务就从服务中取数，没有服务就从Model中取数
      const detail = await service(model);

      setState(preState => {
        return {
          ...preState,
          detail,
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

      const model = e.item.getModel();
      // 有数据服务就从服务中取数，没有服务就从Model中取数
      const detail = await service(model);

      setState(preState => {
        return {
          ...preState,
          detail,
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
  }, [graph, setState, service]);

  const { visible, detail, isLoading } = state;

  const content = !isLoading && detail ? <Properties data={detail} /> : <Skeleton active />;
  const container = document.getElementById(`${GISDK_ID}-graphin-container`) as HTMLDivElement;
  return (
    <Drawer
      visible={visible}
      placement={placement}
      onClose={handleClose}
      title={'属性面板'}
      width={`${width}px`}
      mask={false}
      bodyStyle={{
        padding: '12px 24px',
      }}
      getContainer={container}
    >
      {content}
    </Drawer>
  );
};

export default PropertiesPanel;
