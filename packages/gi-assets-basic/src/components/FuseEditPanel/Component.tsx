import { useContext, utils } from '@alipay/graphinsight';
import { Drawer } from 'antd';
import React from 'react';

export interface FuseEditPanelProps {
  serviceId?: string;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const FuseEditPanel: React.FunctionComponent<FuseEditPanelProps> = props => {
  const { serviceId } = props;
  const { graph, services } = useContext();
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
    const handleComboClick = async e => {
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

    graph.on('combo:click', handleComboClick);
    graph.on('canvas:click', handleClose);
    return () => {
      graph.off('combo:click', handleComboClick);
      graph.off('canvas:click', handleClose);
    };
  }, [graph, setState, service]);

  const { visible } = state;

  return (
    <Drawer
      visible={visible}
      placement="right"
      onClose={handleClose}
      title={'融合实体类型'}
      width={'356px'}
      style={{
        marginTop: '61px',
      }}
      mask={false}
      bodyStyle={{
        padding: '12px 24px',
      }}
    >
      在这里自定义融合实体类型面板
    </Drawer>
  );
};

export default FuseEditPanel;
