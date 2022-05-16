import GISDK from '@alipay/graphinsight';
import React from 'react';
import { queryAssets } from '../../services/assets.market';
import getServicesByConfig from '../Analysis/getAssets/getServicesByConfig';
const Share = props => {
  const { match } = props;
  const { shareId } = match.params;
  const [state, setState] = React.useState({
    isReady: false,
    assets: {},
    services: {},
  });
  const { data, config, schema, services: ServicesConfig } = JSON.parse(localStorage.getItem(shareId));

  React.useEffect(() => {
    const { components } = config;
    const activeAssetsKeys = {
      components: components.map(c => c.id),
      elements: ['SimpleEdge', 'SimpleNode', 'DountNode'],
      layouts: ['GraphinForce', 'Concentric', 'Dagre'],
    };
    const services = getServicesByConfig(ServicesConfig, data, schema);
    queryAssets(activeAssetsKeys).then(res => {
      setState(preState => {
        return {
          ...preState,
          isReady: true,
          assets: res,
          services,
        };
      });
    });
  }, []);
  const { isReady, assets, services } = state;
  if (!isReady) {
    return null;
  }
  return (
    <GISDK
      config={config}
      //@ts-ignore
      assets={assets}
      //@ts-ignore
      services={services}
    ></GISDK>
  );
};

export default Share;
