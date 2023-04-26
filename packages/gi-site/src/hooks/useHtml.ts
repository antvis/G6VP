import { beautifyCode, getConstantFiles, HTML_SCRIPTS, MY_GRAPH_SDK } from './common';

const getHtmlAppCode = opts => {
  const { GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT, GI_ASSETS_PACKAGE, THEME_STYLE, HTML_HEADER } =
    getConstantFiles(opts);

  /** G6VP 站点图数据和 Schema 信息 **/
  const { data, schemaData } = window['LOCAL_DATA_FOR_GI_ENGINE'];
  const formatData = beautifyCode(JSON.stringify(data));
  const formatSchemaData = beautifyCode(JSON.stringify(schemaData));

  return `
  <!DOCTYPE html>
<html lang="en" ${THEME_STYLE} >
  ${HTML_HEADER}
  <body>
    <div id="root"></div>
    <script src="https://gw.alipayobjects.com/os/lib/babel/standalone/7.19.2/babel.min.js"></script>
    
     
    ${HTML_SCRIPTS}
    <script>
    /**  由GI平台自动生成的，请勿修改 start **/

    const GI_ASSETS_PACKAGE = ${GI_ASSETS_PACKAGE};
    const SERVER_ENGINE_CONTEXT= ${SERVER_ENGINE_CONTEXT};
    const GI_PROJECT_CONFIG = ${GI_PROJECT_CONFIG};

    window['LOCAL_DATA_FOR_GI_ENGINE'] = {
      data: ${formatData},
      schemaData: ${formatSchemaData},
    };
    
    /**  由GI平台自动生成的，请勿修改 end **/
    </script>

    <script type="text/babel">
   
 
  
      ${MY_GRAPH_SDK}

    </script>

  </body>
</html>
    `;
};

export default getHtmlAppCode;
