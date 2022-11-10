import GISDK, { utils } from '@antv/gi-sdk';
import React from 'react';
import { getProjectList } from '../../services';
import { queryAssets } from '../../services/assets.market';
import { IS_LOCAL_ENV } from '../../services/const';
import { querySharedAnalysisById } from '../../services/share';
import getServicesByConfig from '../Analysis/getAssets/getServicesByConfig';

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
    // 线上的保存
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
            //@ts-ignore
            const assetServices = utils.getCombineServices(res_assets.services);
            return {
              ...preState,
              config,
              isReady: true,
              assets: res_assets,
              services: [...assetServices, ...services],
            };
          });
        });
      });
      return;
    }

    // 本地的保存分享
    getProjectList('save').then(res => {
      const project = res.find(d => d.id === shareId);
      if (!project) {
        return;
      }
      const { data, config } = project;
      const activeAssetsKeys = {
        components: config?.components?.map(c => c.id),
        elements: ['SimpleEdge', 'SimpleNode', 'DountNode'],
        layouts: ['GraphinForce', 'Concentric', 'Dagre'],
      };

      queryAssets(activeAssetsKeys).then(res_assets => {
        //@ts-ignore
        const assetServices = utils.getCombineServices(res_assets.services);
        assetServices.forEach(item => {
          // 在 GraphInsight 上的保存，本质是重新复写了初始化函数
          if (item.id === 'GI/GI_SERVICE_INTIAL_GRAPH') {
            item.service = () => {
              return new Promise(resolve => {
                resolve(data);
              });
            };
          }
        });
        //@ts-ignore
        setState(preState => {
          return {
            ...preState,
            config,
            isReady: true,
            assets: res_assets,
            services: assetServices,
          };
        });
      });
    });
  }, []);
  const { isReady, assets, services, config } = state;
  if (!isReady) {
    return null;
  }

  return (
    <GISDK
      id="share-studio"
      config={config}
      assets={assets}
      //@ts-ignore
      services={services}
    ></GISDK>
  );
};

export default Share;
