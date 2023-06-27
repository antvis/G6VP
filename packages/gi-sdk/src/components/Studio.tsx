import * as React from 'react';
import GISDK from '../GISDK';
import { getCombineServices, loaderCombinedAssets } from '../process';

export interface Project {
  dataset: {
    data: {};
    schemaData: {};
    engineId: string;
    id: string;
    name: string;
    engineContext: {};
  };
  workbook: {
    activeAssetsKeys: {};
    id: string;
    name: string;
    projectConfig: {};
    themes: {};
  };
  deps: {
    [pkgName: string]: string;
  };
  GI_ASSETS_PACKAGES: {
    [key: string]: {
      global: string;
      name: string;
      url: string;
      version: string;
    };
  };
}
export interface StudioProps {
  id: string;
  service: (id: string) => Promise<{ data: Project }>;
}

const Studio: React.FunctionComponent<StudioProps> = props => {
  const { id, service } = props;
  const [state, setState] = React.useState({
    isReady: false,
    assets: null,
    config: {},
    services: [],
  });

  const starStudio = async () => {
    try {
      const { data } = await service(id);
      const { dataset, workbook, GI_ASSETS_PACKAGES } = data;
      const { projectConfig } = workbook;
      const { engineContext } = dataset;
      // 根据包名，请求资产
      const assets = await loaderCombinedAssets(Object.values(GI_ASSETS_PACKAGES));
      // 设置引擎上下文
      window.localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify(engineContext));
      const services = getCombineServices(assets.services);
      setState(preState => {
        return {
          ...preState,
          isReady: true,
          assets,
          services,
          config: projectConfig,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    starStudio();
  }, []);
  const { assets, isReady, config, services } = state;
  if (!isReady) {
    return <div> 正在加载应用... </div>;
  }
  return (
    <>
      {/** @ts-ignore */}
      <GISDK config={config} assets={assets} services={services} id={`GI_STUDIO_${id}`} />
    </>
  );
};

export default Studio;
