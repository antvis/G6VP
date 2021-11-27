import beautify from 'js-beautify';
import { SERVICE_URL_PREFIX } from '../services/const';
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

  const temaplteCode = beautifyCode(JSON.stringify(config));
  const serviceConfigStr = beautifyCode(JSON.stringify(serviceConfig));

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
    <link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/alipay/gi-assets/0.5.0/dist/index.css" />
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel">
      window.onload = () => {
        const GeaMakerGISDK = () => {
          const giProjectURL = "${SERVICE_URL_PREFIX}/project/id";
          const giProjectId = "${id}";
          const servicesOpt = ${serviceConfigStr};
          
          const { utils, ...ASSETS } = GIAssets;
          const [state, setState] = React.useState({
            isReady: false,
            data: {},
            assets: {},
          });
          React.useEffect(() => {
            fetch(giProjectURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: giProjectId,
              }),
            })
              .then(res => res.json())
              .then(res => {
                const data = JSON.parse(res.data[0].data).transData;
                const projectConfig = JSON.parse(res.data[0].projectConfig);
                const services = GIAssets.utils.getServicesByAssets(servicesOpt, data);

                const assets = {
                  ...ASSETS,
                  services,
                };
                console.log(res, data, assets, ASSETS, projectConfig);
                setState(preState => {
                  return {
                    data: res,
                    isReady: true,
                    assets,
                    config: projectConfig,
                  };
                });
              });
          }, []);

          const { assets, isReady, config } = state;
          if (!isReady) {
            return <div> graph is loading... </div>;
          }
          return <GISDK.default config={config} assets={assets} />;
        };

        const Header = ({ text }) => {
        
          return (
            <div style={{ height: '100vh' }}>
              <h1>GISDK Load from Remote Server</h1>
              <GeaMakerGISDK />
            </div>
          );
        };

        ReactDOM.render(<Header text="graph insight" />, document.getElementById('root'));
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
    <script src="https://gw.alipayobjects.com/os/lib/alipay/gi-assets/0.5.0/dist/index.min.js"></script>
    <script src="https://gw.alipayobjects.com/os/lib/alipay/graphinsight/0.5.0/dist/index.min.js"></script>

  </body>
</html>
    `;
};

export default getHtmlAppCode;
