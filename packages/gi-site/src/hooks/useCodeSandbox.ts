import SDK_PACKAGE from '@alipay/graphinsight/package.json';
import LZString from 'lz-string';
import { useEffect, useState } from 'react';
import { getAssetPackages, Package } from '../loader';
import { beautifyCode, getActivePackageName } from './common';

const packages = getAssetPackages();
const packagesStr = beautifyCode(JSON.stringify(Object.values(packages)));

const CSB_API_ENDPOINT = 'https://codesandbox.io/api/v1/sandboxes/define';

function serialize(data: Record<string, any>) {
  return LZString.compressToBase64(JSON.stringify(data))
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

const getConstantFiles = opts => {
  const {
    config,
    id,
    //  data, schemaData, serviceConfig,
    engineId,
    engineContext,
    activeAssets,
  } = opts;
  const SERVER_ENGINE_CONTEXT = beautifyCode(
    JSON.stringify({
      GI_SITE_PROJECT_ID: id,
      engineId,
      ...engineContext,
    }),
  );

  const GI_PROJECT_CONFIG = beautifyCode(JSON.stringify(config));
  // const GI_LOCAL_DATA = beautifyCode(JSON.stringify(data));
  // const GI_SERVICES_OPTIONS = beautifyCode(JSON.stringify(serviceConfig));
  // const GI_SCHEMA_DATA = beautifyCode(JSON.stringify(schemaData));

  const activePackages = getActivePackageName(activeAssets);
  const allPackages = getAssetPackages();
  const packages = activePackages.map(k => {
    return allPackages.find(c => {
      return k == c.name;
    });
  }) as Package[];

  const GI_ASSETS_PACKAGE = beautifyCode(JSON.stringify(Object.values(packages)));

  return {
    SERVER_ENGINE_CONTEXT,
    // GI_SERVICES_OPTIONS,
    GI_PROJECT_CONFIG,
    // GI_LOCAL_DATA,
    // GI_SCHEMA_DATA,
    GI_ASSETS_PACKAGE,
  };
};
function getCSBData(opts) {
  console.log('opts', opts);

  const ext = '.tsx';
  const files: Record<string, { content: string }> = {};

  const entryFileName = `src/index${ext}`;

  const { GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT, GI_ASSETS_PACKAGE } = getConstantFiles(opts);

  files['src/GI_EXPORT_FILES.ts'] = {
    content: ` 
      /** 动态请求需要的配套资产 **/
      export const GI_ASSETS_PACKAGE = ${GI_ASSETS_PACKAGE};

      /** GraphInsight 站点自动生成的配置 **/
      export const GI_PROJECT_CONFIG = ${GI_PROJECT_CONFIG};
      
      /** GraphInsight 站点选择服务引擎的上下文配置信息 **/
      export const SERVER_ENGINE_CONTEXT = ${SERVER_ENGINE_CONTEXT};
    
    `,
  };

  files['src/index.tsx'] = {
    content: `
// import GISDK from "@alipay/graphinsight"; （预计7月份开放）
// 因为没有做 external，避免多个版本react冲突，统一从window对象中获取
// import React from "react";
// import ReactDOM from "react-dom";

import {  GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT,GI_ASSETS_PACKAGE } from "./GI_EXPORT_FILES";
//@ts-ignore
const { loaderCombinedAssets, getCombineServices } = window.GISDK.utils;
/**  设置服务引擎的上下文 **/
window.localStorage.setItem( 'SERVER_ENGINE_CONTEXT', JSON.stringify(SERVER_ENGINE_CONTEXT));

interface AppProps {}


const App= (props) => {
  const [state,setState]=  window.React.useState({
    isReady:false,
    assets:null,
    config:GI_PROJECT_CONFIG,
    services:[]
  });
  window.React.useEffect(()=>{
    loaderCombinedAssets(GI_ASSETS_PACKAGE).then(res=>{
      /** 生成服务 */
      const services = getCombineServices(res.services)
    
      setState(preState=>{
        return {
          ...preState,
          isReady:true,
          assets:res,
          services,
        }
      })
    })
  },[]);
  const {assets,isReady,config,services} =state;
  if(!isReady){
    return <div>loading...</div>
  }
  return (
    <div>
      <div style={{ height: "100vh" }}>
        {/** @ts-ignore */}
        <window.GISDK.default
          config={config}
          assets={assets}
          services={services}
        />
      </div>
    </div>
  );
};

// 因为没有做 external，避免多个版本react冲突，统一从window对象中获取
//@ts-ignore
window.ReactDOM.render(<App />, document.getElementById("root"));

    `,
  };

  files['package.json'] = {
    content: JSON.stringify(
      {
        name: '',
        description: '',
        main: entryFileName,
        dependencies: {},
        devDependencies: { typescript: '^3' },
      },
      null,
      2,
    ),
  };

  files['public/index.html'] = {
    content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <!--- CSS -->
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.3.0/dist/GraphInsight/light.css" />
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/index.css" />
   

  </head>
  <body>
    <div id="root"></div>
    <!--- REACT DEPENDENCIES-->
    <script crossorigin src="https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js"></script>
    <script
      crossorigin
      src="https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js"
    ></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!--- Antd DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/antd/4.20.4/dist/antd.min.js"></script>
    <!--- Graphin DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/antv/g6/4.6.4/dist/g6.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/graphin.min.js"></script>
    <!--- G2/G2Plot DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js"></script>
    <!--- GI DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/alipay/graphinsight/${SDK_PACKAGE.version}/dist/index.min.js"></script>
 
     </body>
</html>
    
  
  `,
  };

  return serialize({ files });
}

export default opts => {
  const [handler, setHandler] = useState<(...args: any) => void | undefined>();

  useEffect(() => {
    if (opts) {
      const form = document.createElement('form');
      const input = document.createElement('input');
      const data = getCSBData(opts);

      form.method = 'POST';
      form.target = '_blank';
      form.style.display = 'none';
      form.action = CSB_API_ENDPOINT;
      form.appendChild(input);
      form.setAttribute('data-demo', opts.title || '');

      input.name = 'parameters';
      input.value = data;

      document.body.appendChild(form);

      setHandler(() => () => form.submit());

      return () => form.remove();
    }
  }, [opts]);

  return handler;
};
