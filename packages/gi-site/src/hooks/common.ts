import { GIAssets } from '@antv/gi-sdk';
import beautify from 'js-beautify';
import ThemeVars from '../components/ThemeVars';
import { ANTD_VERSION, G6_VERSION, GI_VERSION } from '../env';
import $i18n from '../i18n';
import type { Package } from '../loader';
import { getAssetPackages } from '../loader';

export function beautifyCode(code: string) {
  //@ts-ignore
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

export const getActivePackage = (activeAssets: GIAssets) => {
  const { components, elements, layouts } = activeAssets;

  const componentsMap = new Map<string, any>();
  const elementsMap = new Map<string, any>();
  const layoutsMap = new Map<string, any>();

  if (components) {
    Object.values(components).forEach(c => {
      //@ts-ignore
      const id = c.pkg;
      const val = componentsMap.get(id);
      if (val) {
        componentsMap.set(id, [...val, c]);
      } else {
        componentsMap.set(id, [c]);
      }
    });
  }
  if (elements) {
    Object.values(elements).forEach(c => {
      //@ts-ignore
      const id = c.pkg;
      const val = elementsMap.get(id);
      if (val) {
        elementsMap.set(id, [...val, c]);
      } else {
        elementsMap.set(id, [c]);
      }
    });
  }
  if (layouts) {
    Object.values(layouts).forEach(c => {
      //@ts-ignore
      const id = c.pkg;
      const val = layoutsMap.get(id);
      if (val) {
        layoutsMap.set(id, [...val, c]);
      } else {
        layoutsMap.set(id, [c]);
      }
    });
  }

  return {
    layoutsMap,
    elementsMap,
    componentsMap,
  };
};

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
  const { config, id, engineId, theme = 'light', data, schemaData } = opts;

  const activeAssets = {
    ...opts.activeAssets,
    services: opts.activeAssets.services.filter(item => {
      return item.id === 'GI' || item.id === engineId;
    }),
  };

  // const GI_SERVICES_OPTIONS = beautifyCode(JSON.stringify(serviceConfig));
  const THEME_STYLE = Object.entries(ThemeVars[theme])
    //@ts-ignore
    .reduce((acc, curr) => {
      return [...acc, curr.join(':')];
    }, [])
    .join(';');

  const HTML_HEADER = $i18n.get(
    {
      id: 'gi-site.src.hooks.common.HeadMetaCharsetUtfMeta',
      dm: '\n<head>\n<meta charset="UTF-8" />\n<meta http-equiv="X-UA-Compatible" content="IE=edge" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>GISDK EXPORT FILE</title>\n<!--- CSS -->\n<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin/{GRAPHINVERSION}/dist/index.css" />\n<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-sdk/{GIVERSION}/dist/index.css" /> \n<!--- 这里 Antd 的全局CSS样式，可以由也业务统一定制 -->\n<!---<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antd/{ANTDVERSION}/dist/antd.css" /> -->\n<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/{theme}.css" /> \n\n</head>\n',
    },
    { GIVERSION: GI_VERSION, ANTDVERSION: ANTD_VERSION, theme: theme },
  );

  const engineContext = JSON.parse(localStorage.getItem('SERVER_ENGINE_CONTEXT')!);
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
    packages,
    THEME_VALUE: theme,
    // GI_SERVICES_OPTIONS,
  };
};

export const HTML_HEADER = `
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GISDK EXPORT FILE</title>
<!--- CSS -->
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
<script src="https://gw.alipayobjects.com/os/lib/localforage/1.10.0/dist/localforage.min.js"></script>
<!--- Antd DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js"></script>
<script src="https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js"></script>
<!--- Graphin DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js"></script>

<!--- G2/G2Plot DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js"></script>
<!--- GI DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/antv/gi-sdk/${GI_VERSION}/dist/index.min.js"></script>
`;

export const MY_GRAPH_SDK = $i18n.get({
  id: 'gi-site.src.hooks.common.TsIgnoreConstGetcombineservicesLoadercombinedassets',
  dm: '\n\n//@ts-ignore\nconst {  getCombineServices,loaderCombinedAssets } = window.GISDK.utils;\nconst { GI_SITE_PROJECT_ID } = SERVER_ENGINE_CONTEXT;\n// 设置引擎上下文\nwindow.localStorage.setItem( \'SERVER_ENGINE_CONTEXT\', JSON.stringify(SERVER_ENGINE_CONTEXT));\n\nconst MyGraphApp= (props) => {\n  const [state,setState]= React.useState({\n    isReady:false,\n    assets:null,\n    config:{},\n    services:[]\n  });\n  React.useEffect(()=>{\n    loaderCombinedAssets(GI_ASSETS_PACKAGE).then(res=>{\n      /** 生成服务 */\n      const services = getCombineServices(res.services)\n      setState(preState=>{\n        return {\n          ...preState,\n          isReady:true,\n          assets:res,\n          services,\n          config:GI_PROJECT_CONFIG,\n        }\n      })\n    })\n  },[]);\n  const {assets,isReady,config,services} =state;\n  if(!isReady){\n    return <div>loading...</div>\n  }\n  return (\n    <div>\n      <div style={{ height: "100vh" }}>\n        {/** @ts-ignore */}\n        <window.GISDK.default\n          config={config}\n          assets={assets}\n          services={services}\n        />\n      </div>\n    </div>\n  );\n};\n\n// 因为没有做 external，避免多个版本react冲突，统一从window对象中获取\n\n//@ts-ignore \nwindow.ReactDOM.render(<MyGraphApp />, document.getElementById("root"));\n \n',
});
