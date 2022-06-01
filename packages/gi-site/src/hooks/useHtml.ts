import SDK_PACKAGE from '@alipay/graphinsight/package.json';
import { produce } from 'immer';
import beautify from 'js-beautify';
import { getAssetPackages, getCombinedAssets } from '../loader';
export function beautifyCode(code: string) {
  return beautify(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: -1,
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    brace_style: 'collapse',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 120,
    e4x: false,
  });
}
/**
 * get js code for Riddle
 * @param opts  previewer props
 */
const getHtmlAppCode = opts => {
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

  const configStr = beautifyCode(JSON.stringify(config));
  const dataStr = beautifyCode(JSON.stringify(data));
  const serviceStr = beautifyCode(JSON.stringify(serviceConfig));
  const packages = getAssetPackages();
  const combinedAssets = getCombinedAssets();
  const GI_SCHEMA_DATA = beautifyCode(JSON.stringify(schemaData));

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
  const packagesStr = beautifyCode(JSON.stringify(Object.values(packages)));

  return `
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
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/alipay/graphinsight/${SDK_PACKAGE.version}/dist/index.css" /> 
    ${GIAssetsLinks}
 
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
/** 计算逻辑 **/
    const packages = ${packagesStr};
    const getAssets = () => {
      return packages
        .map(item => {
          let assets = window[item.global];
          if (!assets) {
            return null;
          }
          if (assets.hasOwnProperty('default')) {
            assets = assets.default;
          }
          return {
            ...item,
            assets,
          };
        })
        .filter(c => {
          return c;
        });
    };

const getCombinedAssets = () => {
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
    },
  );
};

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}
const defaultTransFn = (data, params) => {
  return data;
};
const getServicesByConfig = (serviceConfig, LOCAL_DATA, schemaData) => {
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



      /**  由GI平台自动生成的，请勿修改 start **/
 
      const GI_SERVICES_OPTIONS = ${serviceStr};
      const GI_PROJECT_CONFIG = ${configStr};
      const GI_LOCAL_DATA = ${dataStr};
      const GI_SCHEMA_DATA = ${GI_SCHEMA_DATA};
      
      /**  由GI平台自动生成的，请勿修改 end **/
   
      const assets = getCombinedAssets();
    const MyGraphSdk = () => {
      const config = GI_PROJECT_CONFIG;
      const services = getServicesByConfig(GI_SERVICES_OPTIONS,GI_LOCAL_DATA,GI_SCHEMA_DATA);
    
      return  <div style={{ height: '100vh' }}>
        <GISDK.default config={config} assets={assets} services={services}/>
      </div>;
    };
      window.onload = () => {
        ReactDOM.render(<MyGraphSdk />, document.getElementById('root'));
      };
    </script>
    
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
    ${GIAssetsScripts}
  </body>
</html>
    `;
};

export default getHtmlAppCode;
