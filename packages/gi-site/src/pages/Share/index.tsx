import GISDK from '@alipay/graphinsight';
import React from 'react';
import { getProjectList } from '../../services';
import { queryAssets } from '../../services/assets.market';
import { querySharedAnalysisById } from '../../services/share';
import getServicesByConfig from '../Analysis/getAssets/getServicesByConfig';
import { IS_LOCAL_ENV } from '../../services/const';

const Share = props => {
  const { match } = props;
  const { shareId } = match.params;
  const [state, setState] = React.useState({
    isReady: false,
    assets: {},
    services: {},
    config: {},
  });

  React.useEffect(() => {
    if (!IS_LOCAL_ENV) {
      querySharedAnalysisById(shareId).then(res => {
        console.log('online', res);
        const { params } = res;
        const { data, config, schema, services: ServicesConfig } = JSON.parse(params);
        const { components } = config;
        const activeAssetsKeys = {
          components: components.map(c => c.id),
          elements: ['SimpleEdge', 'SimpleNode', 'DountNode'],
          layouts: ['GraphinForce', 'Concentric', 'Dagre'],
        };
        const services = getServicesByConfig(ServicesConfig, data, schema);
        queryAssets(activeAssetsKeys).then(res_assets => {
          setState(preState => {
            return {
              ...preState,
              config,
              isReady: true,
              assets: res_assets,
              services,
            };
          });
        });
      });
    } else {
      getProjectList('save').then(res => {
        const project = res.find(d => d.id === shareId);
        if (!project) {
          return;
        }

        const { data, config, schema, services: ServicesConfig } = project;
        const { components } = config;
        const activeAssetsKeys = {
          components: components.map(c => c.id),
          elements: ['SimpleEdge', 'SimpleNode', 'DountNode'],
          layouts: ['GraphinForce', 'Concentric', 'Dagre'],
        };
        const services = getServicesByConfig(ServicesConfig, data, schema);
        queryAssets(activeAssetsKeys).then(res_assets => {
          setState(preState => {
            return {
              ...preState,
              config,
              isReady: true,
              assets: res_assets,
              services,
            };
          });
        });
      });
    }
  }, []);
  const { isReady, assets, services, config } = state;
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
