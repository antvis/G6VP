import beautify from 'js-beautify';
import liaoyuan from '../mock/liaoyuan.json';
/**
 * 复制功能
 * @param {String} value
 */
export function copyText(value: string) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  // “啦啦啦”是要copy的内容，自己可以去设置
  input.setAttribute('value', value);
  input.select();
  let flag = false;
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    flag = true;
  }
  document.body.removeChild(input);
  return flag;
}

/**
 * 下载功能
 * @param {String} content
 * @param {String} filename
 */
export function saveAs(content: string, filename: string) {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

/** 格式化代码   配置项：https://beautifier.io/
 * @param {String} code
 */
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

export function generatorconfigToCode(config: object) {
  const temaplteCode = beautifyCode(JSON.stringify(config));
  const sourceCode = beautifyCode(JSON.stringify(liaoyuan));
  return `
import GISDK from '@alipay/graphinsight';
  
const config = ${temaplteCode};
const liaoyuan = ${sourceCode};

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
    const data = getGraphDataTrans(transform(liaoyuan))
    return resolve(data);  
  });
};
const getSubGraphData = (ids) => {
  return new Promise(resolve => {
    const data = getSubGraphDataTrans(transform(liaoyuan),ids)
    return resolve(data);  
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
}
