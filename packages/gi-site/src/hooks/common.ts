import { GIAssets } from '@antv/gi-sdk';
import beautify from 'js-beautify';
import { ANTD_VERSION, G6_VERSION, GI_VERSION, GRAPHIN_VERSION } from '../../.umirc';
import ThemeVars from '../components/ThemeVars';
import type { Package } from '../loader';
import { getAssetPackages } from '../loader';

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

export const getActivePackageName = (activeAssets: GIAssets): string[] => {
  const { services, components, elements, layouts } = activeAssets;
  const match = new Set<string>();
  if (services) {
    services.forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }

  if (components) {
    Object.values(components).forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }
  if (elements) {
    Object.values(elements).forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }
  if (layouts) {
    Object.values(layouts).forEach(c => {
      //@ts-ignore
      match.add(c.pkg);
    });
  }

  return [...match.values()];
};

export const getConstantFiles = opts => {
  const { config, id, engineId, engineContext, activeAssets, theme } = opts;
  // const GI_LOCAL_DATA = beautifyCode(JSON.stringify(data));
  // const GI_SERVICES_OPTIONS = beautifyCode(JSON.stringify(serviceConfig));
  // const GI_SCHEMA_DATA = beautifyCode(JSON.stringify(schemaData));
  const THEME_STYLE = Object.entries(ThemeVars[theme])
    //@ts-ignore
    .reduce((acc, curr) => {
      return [...acc, curr.join(':')];
    }, [])
    .join(';');

  const HTML_HEADER = `
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GISDK EXPORT FILE</title>
<!--- CSS -->
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin/${G6_VERSION}/dist/index.css" />
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-sdk/${GI_VERSION}/dist/index.css" /> 
<!--- 这里 Antd 的全局CSS样式，可以由也业务统一定制 -->
<!---<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.css" /> -->
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/${theme}.css" /> 

</head>
`;

  const SERVER_ENGINE_CONTEXT = beautifyCode(
    JSON.stringify({
      GI_SITE_PROJECT_ID: id,
      engineId,
      ...engineContext,
    }),
  );
  const GI_PROJECT_CONFIG = beautifyCode(JSON.stringify(config));
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
    GI_PROJECT_CONFIG,
    GI_ASSETS_PACKAGE,
    THEME_STYLE: `style="${THEME_STYLE}"`,
    HTML_HEADER,
    // GI_SERVICES_OPTIONS,
    // GI_LOCAL_DATA,
    // GI_SCHEMA_DATA,
  };
};

export const HTML_HEADER = `
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GISDK EXPORT FILE</title>
<!--- CSS -->
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin/${G6_VERSION}/dist/index.css" />
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-sdk/${GI_VERSION}/dist/index.css" /> 
<!--- 这里 Antd 的全局CSS样式，可以由也业务统一定制 -->
<!---<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.css" /> -->
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/${
  localStorage.getItem('@theme') || 'light'
}.css" /> 

</head>
`;

export const HTML_SCRIPTS = `
<!--- REACT DEPENDENCIES-->
<script crossorigin src="https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js"></script>
<script crossorigin src="https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js"></script>

<!--- Antd DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js"></script>
<script src="https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js"></script>
<!--- Graphin DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js"></script>
<script src="https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/graphin.min.js"></script>
<!--- G2/G2Plot DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js"></script>
<!--- GI DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/antv/gi-sdk/${GI_VERSION}/dist/index.min.js"></script>
`;

export const MY_GRAPH_SDK = `

//@ts-ignore
const {  getCombineServices,loaderCombinedAssets } = window.GISDK.utils;
window.localStorage.setItem( 'SERVER_ENGINE_CONTEXT', JSON.stringify(SERVER_ENGINE_CONTEXT));

const MyGraphApp= (props) => {
  const [state,setState]= React.useState({
    isReady:false,
    assets:null,
    config:{},
    services:[]
  });
  React.useEffect(()=>{
    loaderCombinedAssets(GI_ASSETS_PACKAGE).then(res=>{
      /** 生成服务 */
      const services = getCombineServices(res.services)
      setState(preState=>{
        return {
          ...preState,
          isReady:true,
          assets:res,
          services,
          config:GI_PROJECT_CONFIG,
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
window.ReactDOM.render(<MyGraphApp />, document.getElementById("root"));
 
`;
