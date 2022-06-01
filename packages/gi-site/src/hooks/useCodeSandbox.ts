import SDK_PACKAGE from '@alipay/graphinsight/package.json';
import { produce } from 'immer';
import LZString from 'lz-string';
import { useEffect, useState } from 'react';
import { getAssetPackages } from '../loader';
import { beautifyCode } from './common';

const packages = getAssetPackages();
const packagesStr = beautifyCode(JSON.stringify(Object.values(packages)));

const GIAssetsScripts = packages
  .map(pkg => {
    return `<script src="${pkg.url}"></script>`;
  })
  .join('\n  ');
const GIAssetsLinks = packages
  .map(pkg => {
    const href = pkg.url.replace('min.js', 'css');
    return `<link rel="stylesheet" href="${href}" />`;
  })
  .join('\n  ');

const CSB_API_ENDPOINT = 'https://codesandbox.io/api/v1/sandboxes/define';

function serialize(data: Record<string, any>) {
  return LZString.compressToBase64(JSON.stringify(data))
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
}

const getConstantFiles = opts => {
  const { data, id, schemaData } = opts;

  const config = produce(opts.config, draft => {
    try {
      delete draft.node.meta;
      delete draft.node.info;
      delete draft.edge.meta;
      delete draft.edge.info;
    } catch (error) {
      console.warn(error);
    }
  });
  const serviceConfig = produce(opts.serviceConfig, draft => {
    draft.forEach(s => {
      delete s.others;
    });
  });

  try {
  } catch (error) {
    console.log('error', error);
  }

  const GI_PROJECT_CONFIG = beautifyCode(JSON.stringify(config));
  const GI_LOCAL_DATA = beautifyCode(JSON.stringify(data));
  const GI_SERVICES_OPTIONS = beautifyCode(JSON.stringify(serviceConfig));
  const GI_SCHEMA_DATA = beautifyCode(JSON.stringify(schemaData));
  return {
    GI_SERVICES_OPTIONS,
    GI_PROJECT_CONFIG,
    GI_LOCAL_DATA,
    GI_SCHEMA_DATA,
  };
};
function getCSBData(opts) {
  console.log('opts', opts);

  const ext = '.tsx';
  const files: Record<string, { content: string }> = {};

  const entryFileName = `src/index${ext}`;

  const { GI_SERVICES_OPTIONS, GI_PROJECT_CONFIG, GI_LOCAL_DATA, GI_SCHEMA_DATA } = getConstantFiles(opts);

  files['src/GI_EXPORT_FILES.ts'] = {
    content: `
    export const GI_SERVICES_OPTIONS = ${GI_SERVICES_OPTIONS};
    export const GI_PROJECT_CONFIG = ${GI_PROJECT_CONFIG};
    export const GI_LOCAL_DATA = ${GI_LOCAL_DATA};
    export const GI_SCHEMA_DATA = ${GI_SCHEMA_DATA};
    `,
  };
  files['src/utils.ts'] = {
    content: `
export const packages = ${packagesStr};
export const getAssets = () => {
  return packages
    .map((item) => {
      let assets = window[item.global];
      if (!assets) {
        return null;
      }
      if (assets.hasOwnProperty("default")) {
        assets = assets.default;
      }
      return {
        ...item,
        assets,
      };
    })
    .filter((c) => {
      return c;
    });
};

export const getCombinedAssets = () => {
  const assets = getAssets();
  return assets.reduce(
    (acc, curr) => {
      return {
        components: {
          ...acc.components,
          ...curr.assets.components,
        },
        elements: {
          ...acc.elements,
          ...curr.assets.elements,
        },
        layouts: {
          ...acc.layouts,
          ...curr.assets.layouts,
        },
      };
    },
    {
      components: {},
      elements: {},
      layouts: {},
    }
  );
};

export function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ")")();
}
export const defaultTransFn = (data, params) => {
  return data;
};
export const getServicesByConfig = (serviceConfig, LOCAL_DATA, schemaData) => {
  return serviceConfig.map(s => {
    const { id, content, mode } = s;
    const runtimeContent = content?.split('export default')[1] || content;
    const transFn = looseJsonParse(runtimeContent);
    return {
      id,
      content,
      service: (...params) => {
        return transFn(...params, LOCAL_DATA, schemaData);
      },
    };
  });
};
    `,
  };
  files['src/index.tsx'] = {
    content: `
// import GISDK from "@alipay/graphinsight"; （预计7月份开放）
// 因为没有做 external，避免多个版本react冲突，统一从window对象中获取
// import React from "react";
// import ReactDOM from "react-dom";

// import { Counter } from "../components";
import {
  GI_LOCAL_DATA,
  GI_PROJECT_CONFIG,
  GI_SERVICES_OPTIONS,
} from "./GI_EXPORT_FILES";
import { getCombinedAssets, getServicesByConfig } from "./utils";

interface AppProps {}

/** 生产资产 */
const assets = getCombinedAssets();
/** 生成配置 */
const config = GI_PROJECT_CONFIG;
/** 生成服务 */
const services = getServicesByConfig(GI_SERVICES_OPTIONS, GI_LOCAL_DATA);

/** 更新资产 */
// assets.components["Counter"] = Counter;
/** 更新配置 */
//@ts-ignore
// config.components.push({
//   id: "Counter",
//   //@ts-ignore
//   props: {},
// });
/** 更新服务 */
// export const MyServices = services.map((c) => {
//   if (c.id === "Mock/PropertiesPanel") {
//     return {
//       ...c,
//       service: (params, localData) => {
//         const data = params.data;
//         console.log("data", data);
//         return new Promise(function (resolve) {
//           return resolve({
//             ...data,
//             desc: "业务可以自定义",
//             myName: "pomelo.lcw",
//             randomKey: Math.random(),
//           });
//         });
//       },
//     };
//   }
//   return c;
// });

const App= (props) => {
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
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.2.3/dist/GraphInsight/light.css" />
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/index.css" />
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/alipay/graphinsight/${SDK_PACKAGE.version}/dist/index.css" /> 
    ${GIAssetsLinks}

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
    <script src="https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js"></script>
    <!--- Graphin DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/antv/g6/4.6.4/dist/g6.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/antv/graphin/2.6.5/dist/graphin.min.js"></script>
    <!--- G2/G2Plot DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js"></script>
    <!--- GI DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/alipay/graphinsight/${SDK_PACKAGE.version}/dist/index.min.js"></script>
    ${GIAssetsScripts}
    
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
