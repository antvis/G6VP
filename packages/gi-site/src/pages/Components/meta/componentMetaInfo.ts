const componentMetas = {
  Legend: {
    options: {
      type: 'group',
      name: '图例',
      fold: false,
      children: {
        sortkey: {
          name: '映射字段',
          type: 'select',
          options: [],
        },
        size: {
          name: '颜色',
          type: 'slider',
          min: 0,
          max: 20,
          step: 1,
          default: 5,
        },
        enabled: {
          name: '是否可见',
          type: 'switch',
        },
      },
    },
  },
  NodeTooltip: {
    options: {
      name: '布局',
      type: 'group',
      fold: false,
      enableHide: false,
      children: {
        toggle: {
          name: '切换布局',
          type: 'select',
          useFont: true,
          default: 'force',
          options: [
            {
              value: 'force',
              label: '经典力导向布局',
            },
          ],
        },
        forceGroup: {
          name: '配置参数',
          type: 'group',
          fold: false,
          children: {
            linkDistance: {
              type: 'slider',
              caption: '边长度',
              min: 1,
              max: 500,
              step: 1,
              default: 100,
            },
            nodeStrength: {
              type: 'slider',
              caption: '节点作用力',
              min: -100,
              max: 500,
              step: 5,
              default: 100,
            },
            edgeStrength: {
              type: 'slider',
              caption: '边作用力',
              default: 0.2,
              step: 0.1,
              min: 0,
              max: 1,
            },
            nodeSpacing: {
              type: 'slider',
              caption: '节点间距',
              default: 15,
              min: 0,
              max: 200,
              step: 1,
            },
            preventOverlap: {
              type: 'switch',
              caption: '防止重叠',
              default: true,
              statusText: false,
            },
          },
        },
      },
    },
  },
  MiniMap: {
    options: {
      name: 'minimap',
      type: 'group',
      fold: false,
      enableHide: false,
      children: {
        width: {
          type: 'slider',
          caption: '宽',
          min: 1,
          max: 500,
          step: 1,
          default: 100,
        },
        height: {
          type: 'slider',
          caption: '高',
          min: 1,
          max: 500,
          step: 1,
          default: 100,
        },
      },
    },
  },
};

export const getComponentMetaInfo = (id: string, data: Object) => {
  if (id === 'Legend' && componentMetas[id]) {
    const { nodes = [] } = data;
    const options = nodes.map(node => {
      return {
        value: node.id,
        label: node.id,
      };
    });
    componentMetas[id].options.children.sortkey.options = options;
  }

  return componentMetas[id];
};
