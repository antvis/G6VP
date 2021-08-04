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
  const { config, data } = opts;
  try {
    delete config.node.meta;
    delete config.node.info;
    delete config.edge.meta;
    delete config.edge.info;
  } catch (error) {}

  const temaplteCode = beautifyCode(JSON.stringify(config));
  const dataStr = beautifyCode(JSON.stringify(data));

  return `
  import GISDK from '@alipay/graphinsight';
  import ASSETS from '@alipay/gi-assets';
 
  const {components,elements,utils}= ASSETS;
  const {getServicesByAssets} = utils;


  const config = ${temaplteCode};
  const data = ${dataStr};
  const servicesOpt = [
    {
      id: 'get_initial_graph',
      content: '(data)=>{return data}',
      mode: 'mock',
    },
  ];
  const assets = {
    components,
    elements,
    services:getServicesByAssets(servicesOpt,data)
  }
  

  const Example = (props) => {
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
