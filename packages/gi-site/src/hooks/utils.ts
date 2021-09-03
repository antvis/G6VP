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
export const getRiddleAppCode = opts => {
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
  import GISDK from '@alipay/graphinsight';
  import ASSETS from '@alipay/gi-assets';
  import Graphin from '@antv/graphin';
 
  /**
   * 注意：新开Riddle 会遇到依赖加载报错问题，
   * 请先保存此Riddle，重新命名，然后刷新浏览器，重新加载即可。
  **/

  const {components,elements,utils}= ASSETS;
  const {getServicesByAssets} = utils;

  const config = ${temaplteCode};
  const giProjectURL = "https://storehouse.test.alipay.net/project/list/${id}";
  const servicesOpt = ${serviceConfigStr};
 

  const basicTrans = data => {
    const nodes = data.nodes.map(n=>{
      return {
        id:n.id,
        data:n
      }
    })
    const edges = data.edges.map(e=>{
      return {
        source:e.source,
        target:e.target,
        data:e
      }
    })
    return { nodes, edges }
  }
  

  const Example = (props) => {
    const [state,setState]= React.useState({
      isReady:false,
      data:{},
      assets:{}
    })
    React.useEffect(()=>{
      fetch(giProjectURL).then(res=>res.json()).then(res=>{
      console.log(res)
      const data = JSON.parse(res.data[0].data)
      const assets = {
          components,
          elements,
          services:getServicesByAssets(servicesOpt,data)
        }
        setState(preState=>{
          return {
            data:res,
            isReady:true,
            assets,
          }
        })
      })
    },[]);

    const {assets,isReady} =state;
    if(!isReady){
      return <div> graph is loading... </div>
    }
    return (
      <GISDK
        config={config}
        assets={assets}
      />
    )
  };
  
  ReactDOM.render(<Example/>, mountNode);
    `;
};
