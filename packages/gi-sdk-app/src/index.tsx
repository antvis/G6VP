import * as React from 'react';

import { loader } from './loaderAssets';
import Loading from './Loading';

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
    config: {};
    themes: {};
    theme?: string;
  };
  deps: {
    [key: string]: {
      global: string;
      name: string;
      url: string;
      version: string;
    };
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
  loadingText?: string;
  loadingComponent?: React.ReactElement;
  extraParams?: Record<string, any>;
  componentExtraParams?: Record<string, any>;
}

const Studio: React.FunctionComponent<StudioProps> = props => {
  // @ts-ignore
  const {
    id,
    service,
    loadingText = '正在加载图应用...',
    loadingComponent,
    extraParams,
    componentExtraParams,
  } = props;
  const [state, setState] = React.useState({
    isReady: false,
    assets: null,
    config: {},
    services: [],
    ThemeComponent: () => null,
    GISDK: () => <></>,
    extraParams: undefined,
    componentExtraParams: undefined,
  });

  const startStudio = async () => {
    try {
      const { data } = await service(id);
      const { dataset, workbook, GI_ASSETS_PACKAGES, deps } = data;
      const { projectConfig, theme = 'light' } = workbook;
      const { engineContext } = dataset;
      const { Graphin: Graphin_DEP, GISDK: GISDK_DEP, ...FirstDeps } = deps;
      // 请求依赖资源包
      await loader(Object.values(FirstDeps));
      // Graphin
      await loader([Graphin_DEP]);
      // GISDK
      await loader([GISDK_DEP]);

      //@ts-ignore
      const { default: GISDK, utils } = window.GISDK;
      // 根据包名，请求资产
      const assets = await utils.loaderCombinedAssets(Object.values(GI_ASSETS_PACKAGES));
      // 设置引擎上下文
      window.localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify(engineContext));
      window.localStorage.setItem('@theme', theme);
      // 特殊情况判断
      if (dataset.engineId === 'GI') {
        //@ts-ignore
        window['LOCAL_DATA_FOR_GI_ENGINE'] = {
          //@ts-ignore
          data: dataset.data.transData,
          schemaData: dataset.schemaData,
        };
      }
      /** 注册 font icon */
      try {
        await utils.registerIconFonts(assets.icons);
      } catch (error) {
        console.log('register font error', error);
      }

      const services = utils.getCombineServices(assets.services);
      setState(preState => {
        return {
          ...preState,
          isReady: true,
          assets,
          services,
          //@ts-ignore
          config: projectConfig || workbook.config,
          //@ts-ignore
          ThemeComponent: (window.GI_THEME_ANTD && window.GI_THEME_ANTD.default) || (() => null),
          //@ts-ignore
          GISDK,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    startStudio();
  }, []);
  const { assets, isReady, config, services, ThemeComponent, GISDK } = state;
  if (!isReady) {
    // 支持传入自定义loading组件
    return loadingComponent ?? <Loading title={loadingText} />;
  }

  return (
    <>
      {/** @ts-ignore */}
      <ThemeComponent style={{ visibility: 'hidden', position: 'absolute' }} />
      {/** @ts-ignore */}
      <GISDK
        // @ts-ignore
        config={config}
        assets={assets}
        services={services}
        id={`GI_STUDIO_${id}`}
        extraParams={extraParams}
        componentExtraParams={componentExtraParams}
      />
    </>
  );
};

export default Studio;
