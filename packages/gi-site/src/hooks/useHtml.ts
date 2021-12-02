import ASSETS_PACKAGE from '@alipay/gi-assets/package.json';
import SDK_PACKAGE from '@alipay/graphinsight/package.json';
import beautify from 'js-beautify';
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
  const { config, data, id, serviceConfig } = opts;
  try {
    delete config.node.meta;
    delete config.node.info;
    delete config.edge.meta;
    delete config.edge.info;
    serviceConfig.forEach(s => {
      delete s.others;
    });
  } catch (error) {}

  const configStr = beautifyCode(JSON.stringify(config));
  const dataStr = beautifyCode(JSON.stringify(data));
  const serviceStr = beautifyCode(JSON.stringify(serviceConfig));

  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <!--- CSS -->
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.css" />
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.0/dist/index.css" />
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/index.css" />
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/alipay/gi-assets/${ASSETS_PACKAGE.version}/dist/index.css" />
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      /**  由GI平台自动生成的，请勿修改 start **/
      const { utils, ...ASSETS } = GIAssets;
      const GI_SERVICES_OPTIONS = ${serviceStr};
      const GI_PROJECT_CONFIG = ${configStr};
      const GI_LOCAL_DATA = ${dataStr};
      /**  由GI平台自动生成的，请勿修改 end **/
   

    const MyGraphSdk = () => {
     
      const config = GI_PROJECT_CONFIG;
      const services = utils.getServicesByAssets(GI_SERVICES_OPTIONS,GI_LOCAL_DATA);
      const assets = {...ASSETS,services};

      return  <div style={{ height: '100vh' }}>
        <GISDK.default config={config} assets={assets} />
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
    <!--- GRAPHIN DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/antd/4.16.13/dist/antd.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/antv/g6/4.3.7/dist/g6.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/antv/graphin/2.4.0/dist/graphin.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/antv/graphin-components/2.4.0/dist/graphin-components.min.js"></script>
    <!--- GI DEPENDENCIES-->
    <script src="https://gw.alipayobjects.com/os/lib/alipay/gi-assets/${ASSETS_PACKAGE.version}/dist/index.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/alipay/graphinsight/${SDK_PACKAGE.version}/dist/index.min.js"></script>

  </body>
</html>
    `;
};

export default getHtmlAppCode;
