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
  const temaplteCode = beautifyCode(JSON.stringify(opts.config));

  return `
  import GISDK from '@alipay/graphinsight';
  
  const config = ${temaplteCode};
  
  /** 转化函数：这些都是后处理 **/
  const transform =  data => {
    const nodes = data.nodes.map(n=>{
      return {
        id:n.uri,
        data:n
      }
    })
    const edges = data.edges.map(e=>{
      return {
        source:e.fromNodeUri,
        target:e.toNodeUri,
        data:e
      }
    })
    return { nodes, edges }
  }
  
  
  const getGraphDataTrans = data => {
    const getEdgesByNodes = (nodes, edges) => {
      const ids = nodes.map(node => node.id);
      return edges.filter(edge => {
        const { source, target } = edge;
        if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
          return true;
        }
        return false;
      });
    };
  
    const nodes = data.nodes.filter(node => {
      return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
    });
  
    const edges = getEdgesByNodes(nodes, data.edges);
  
    return {
      nodes,
      edges,
    };
  };
  
  const getSubGraphDataTrans = (data, ids) => {
    const getEdgesByNodes = (nodes, edges) => {
      const ids = nodes.map(node => node.id);
      return edges.filter(edge => {
        const { source, target } = edge;
        if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
          return true;
        }
        return false;
      });
    };
  
    const propertiesNodes = data.nodes
      .filter(node => {
        return ids.indexOf(node.id) !== -1;
      })
      .map(node => {
        return node.data.properties.map(n => {
          return {
            data: n,
            id: n.uri,
          };
        });
      })
      .reduce((acc, curr) => {
        return [...acc, ...curr];
      }, []);
  
    /**初始化图的节点*/
    const graphOriginNodes = data.nodes.filter(node => {
      return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
    });
    const nodes = [...propertiesNodes, ...graphOriginNodes];
    const edges = getEdgesByNodes(nodes, data.edges);
  
    /** End：组件市场里定义的逻辑;*/
  
    return {
      nodes: propertiesNodes,
      edges,
    };
  };
  
  const getGraphData = () => {
    return new Promise(resolve => {
      fetch('https://gw.alipayobjects.com/os/bmw-prod/88474205-478b-479d-a32a-eff4aae87258.json')
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          const data = getGraphDataTrans(transform(res))
          return resolve(data);
        });
    });
  };
  
  const getSubGraphData = (ids) => {
    return new Promise(resolve => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/88474205-478b-479d-a32a-eff4aae87258.json')
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          const data = getSubGraphDataTrans(transform(res),ids)
          return resolve(data);
        });
    });
  };
  
  const Example = (props) => {
    return (
      <GISDK
        config={config}
        services={{
        getGraphData,
        getSubGraphData,
        }}
      />
    )
  };
  
  ReactDOM.render(<Example/>, mountNode);
    `;
};
