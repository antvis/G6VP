// import GISDK from "@antv/gi-sdk"; （预计7月份开放）
// 因为没有做 external，避免多个版本react冲突，统一从window对象中获取
// import { cloneDeep } from "lodash";
import React from 'react';
import Navbar from '../components-ui/Navbar';
import Server from '../services';
import { GI_ASSETS_PACKAGE, GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT } from './GI_EXPORT_FILES';

import { updateAssets, updateConfig } from './update';
//@ts-ignore
const { GISDK } = window;

const { loaderCombinedAssets, getCombineServices } = GISDK.utils;

/**  设置服务引擎的上下文 **/
window.localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify(SERVER_ENGINE_CONTEXT));

const App = props => {
  const [state, setState] = window.React.useState({
    isReady: false,
    assets: null,
    config: null,
    services: [],
  });
  window.React.useEffect(() => {
    loaderCombinedAssets(GI_ASSETS_PACKAGE).then(res => {
      /** 生成服务 */
      const services = getCombineServices([...res.services, Server]);
      const assets = updateAssets(res);
      //hack-start :因为 umi 的热更新，会导致 config 是已经被 immer 包裹后的 config，因此这里通过 hack 方式解决一些 bug
      // const config = updateConfig(cloneDeep(GI_PROJECT_CONFIG));
      const config = updateConfig(GI_PROJECT_CONFIG);

      console.log('services', services);
      setState(preState => {
        return {
          ...preState,
          isReady: true,
          assets,
          services,
          config,
        };
      });
    });
  }, []);
  const { assets, isReady, config, services } = state;
  if (!isReady) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {/** @ts-ignore */}
      <Navbar />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 48,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        {/** @ts-ignore */}
        <window.GISDK.default id="GS_STUDIO" config={config} assets={assets} services={services} />
      </div>
    </div>
  );
};

export default App;
