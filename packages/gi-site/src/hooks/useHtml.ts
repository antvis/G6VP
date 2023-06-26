import { beautifyCode, getConstantFiles, HTML_SCRIPTS, MY_GRAPH_SDK } from './common';
import $i18n from '../i18n';

const getHtmlAppCode = opts => {
  const { GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT, GI_ASSETS_PACKAGE, THEME_STYLE, HTML_HEADER } =
    getConstantFiles(opts);

  /** G6VP 站点图数据和 Schema 信息 **/
  const { data, schemaData } = window['LOCAL_DATA_FOR_GI_ENGINE'];
  const formatData = beautifyCode(JSON.stringify(data));
  const formatSchemaData = beautifyCode(JSON.stringify(schemaData));

  return $i18n.get(
    {
      id: 'gi-site.src.hooks.useHtml.DoctypeHtmlHtmlLangEn',
      dm: '\n  <!DOCTYPE html>\n<html lang="en" {THEMESTYLE} >\n  {HTMLHEADER}\n  <body>\n    <div id="root"></div>\n    <script src="https://gw.alipayobjects.com/os/lib/babel/standalone/7.19.2/babel.min.js"></script>\n    \n     \n    {HTMLSCRIPTS}\n    <script>\n    /**  由GI平台自动生成的，请勿修改 start **/\n\n    const GI_ASSETS_PACKAGE = {GIASSETSPACKAGE}\n    const SERVER_ENGINE_CONTEXT= {SERVERENGINECONTEXT};\n    const GI_PROJECT_CONFIG = {GIPROJECTCONFIG};\n\n    window[\'LOCAL_DATA_FOR_GI_ENGINE\'] = {\n      data: {formatData},\n      schemaData: {formatSchemaData},\n    };\n    \n    /**  由GI平台自动生成的，请勿修改 end **/\n    </script>\n\n    <script type="text/babel">\n   \n \n  \n      {MYGRAPHSDK}\n\n    </script>\n\n  </body>\n</html>\n    ',
    },
    {
      THEMESTYLE: THEME_STYLE,
      HTMLHEADER: HTML_HEADER,
      HTMLSCRIPTS: HTML_SCRIPTS,
      GIASSETSPACKAGE: GI_ASSETS_PACKAGE,
      SERVERENGINECONTEXT: SERVER_ENGINE_CONTEXT,
      GIPROJECTCONFIG: GI_PROJECT_CONFIG,
      formatData: formatData,
      formatSchemaData: formatSchemaData,
      MYGRAPHSDK: MY_GRAPH_SDK,
    },
  );
};

export default getHtmlAppCode;
