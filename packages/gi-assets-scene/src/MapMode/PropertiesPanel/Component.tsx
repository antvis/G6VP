import { useContext, utils } from '@alipay/graphinsight';
import { L7Plot } from '@antv/l7plot';
import { Drawer, Skeleton } from 'antd';
import React from 'react';
import Properties from './Properties';

export interface PropertiesPanelProps {
  mapInstance: L7Plot;
  geoData: any[];
  updateState: (state: any) => void;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const PropertiesPanel: React.FunctionComponent<PropertiesPanelProps> = props => {
  const { mapInstance, geoData, updateState } = props;
  const { config, services } = useContext();
  const serviceId = React.useMemo(() => {
    try {
      //@ts-ignore
      return config.components.find(c => c.id === 'PropertiesPanel').props.serviceId;
    } catch (error) {
      return undefined;
    }
  }, [config]);
  if (!serviceId) {
    return null;
  }
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
    console.log('effect....', mapInstance);

    const handleNodeClick = async e => {
      console.log('e', e);
      setState(preState => {
        return {
          ...preState,
          visible: true,
          isLoading: true,
        };
      });

      const model = e.feature;
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

      const model = e.feature;
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
    if (!mapInstance) {
      return;
    }
    const nodeLayer = mapInstance.layerGroup.getLayerByName('node');
    const edgeLayer = mapInstance.layerGroup.getLayerByName('edge');
    if (nodeLayer && edgeLayer) {
      nodeLayer.on('click', handleNodeClick);
      edgeLayer.on('click', handleEdgeClick);
    }
    return () => {
      if (nodeLayer && edgeLayer) {
        nodeLayer.off('click', handleNodeClick);
        edgeLayer.off('click', handleEdgeClick);
      }
    };
  }, [geoData]);

  const { visible, detail, isLoading } = state;

  const content = !isLoading && detail ? <Properties data={detail} /> : <Skeleton active />;
  return (
    <Drawer
      visible={visible}
      placement="right"
      onClose={handleClose}
      title={'属性面板'}
      width={'356px'}
      style={{
        marginTop: '61px',
      }}
      mask={false}
      bodyStyle={{
        padding: '12px 24px',
      }}
    >
      {content}
    </Drawer>
  );
};

export default PropertiesPanel;
