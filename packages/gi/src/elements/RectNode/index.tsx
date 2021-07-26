/** 1.定义节点哪些属性可以配置 */
const registerMeta = context => {
  const { data, keys } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    mappingKey: {
      name: '映射字段',
      type: 'select',
      useFont: true,
      default: 'type',
      options,
    },
    fill: {
      name: '颜色',
      type: 'fill',
      default: '#333',
    },
  };
};
/** 2.根据可配置的属性，编写Transform函数 */
const registerTransform = (data, metaConfig) => {
  const { nodes, edges } = data;

  try {
    const { node: nodeConfig, edge: edgeConfig } = metaConfig;
    const { mappingKey, fill } = nodeConfig.props;
    const transNodes = nodes.map(node => {
      return {
        id: node.id,
        type: 'RectNode',
        data: node.data,
        style: {
          text: {
            fill: fill,
            value: node.data[mappingKey],
          },
        },
      };
    });
    return transNodes;
  } catch (error) {
    return nodes;
  }
};
/** 3.根据Transform函数里的数据，即draw函数里的cfg */
const registerShape = Graphin => {
  Graphin.registerNode(
    'RectNode',
    {
      options: {
        style: {},
        stateStyles: {
          hover: {},
          selected: {},
        },
      },
      draw(cfg, group) {
        console.log(cfg);
        const { text = {} } = cfg.style;
        const keyshape = group.addShape('rect', {
          attrs: {
            id: 'circle-floor',
            x: 0,
            y: 0,
            width: 20,
            height: 20,
            fill: 'red',
          },
          draggable: true,
          name: 'circle-floor',
        });
        group.addShape('text', {
          attrs: {
            fontSize: 12,
            x: 0,
            y: 0,
            text: text.value,
            fill: text.fill,
          },
          draggable: true,
          name: 'text',
        });
        return keyshape;
      },
    },
    'single-node',
  );
};

export default {
  registerMeta,
  registerShape,
  registerTransform,
};
