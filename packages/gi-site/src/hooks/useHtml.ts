import { getConstantFiles, HTML_SCRIPTS, MY_GRAPH_SDK } from './common';

const getHtmlAppCode = opts => {
  const { GI_PROJECT_CONFIG, SERVER_ENGINE_CONTEXT, GI_ASSETS_PACKAGE, THEME_STYLE, HTML_HEADER } =
    getConstantFiles(opts);

  return `
  <!DOCTYPE html>
<html lang="en" ${THEME_STYLE} >
  ${HTML_HEADER}
  <body>
    <div id="root"></div>
    <script src="https://gw.alipayobjects.com/os/lib/babel/standalone/7.19.2/babel.min.js"></script>
   
    ${HTML_SCRIPTS}

    <script type="text/babel">
      /**  由GI平台自动生成的，请勿修改 start **/
      /** 动态请求需要的配套资产 **/
      const GI_ASSETS_PACKAGE = ${GI_ASSETS_PACKAGE};
      const SERVER_ENGINE_CONTEXT= ${SERVER_ENGINE_CONTEXT};
      const GI_PROJECT_CONFIG = ${GI_PROJECT_CONFIG};
      /**  由GI平台自动生成的，请勿修改 end **/
  
      ${MY_GRAPH_SDK}

    </script>

  </body>
</html>
    `;
};

export default getHtmlAppCode;
