const registerMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });

  return {
    marker: {
      name: '图元',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        shape: {
          name: '图元-图形',
          type: 'markerMapping',
          valuePath: 'marker',
          schemes: [
            {
              id: '2d',
              name: '2D形状',
              scheme: [
                {
                  label: '圆形',
                  value: 'circle',
                  src: 'https://img.alicdn.com/imgextra/i2/O1CN01kWYHGH1Sv6m0c1aji_!!6000000002308-55-tps-48-48.svg',
                },
                {
                  label: '矩形',
                  value: 'rectangle',
                  src: 'https://img.alicdn.com/imgextra/i1/O1CN01G6r3AJ1x4D7E6QdOT_!!6000000006389-55-tps-48-48.svg',
                },
              ],
            },
          ],
        },
        keyMapping: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'id',
          options,
          showInPanel: {
            conditions: [['marker.mapping', '$eq', true]],
          },
          valuePath: 'marker.key',
        },
      },
    },

    color: {
      name: '颜色',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        colorMapping: {
          name: '填充颜色',
          type: 'colorMapping',
          fixedComponents: ['flat'],
          valuePath: 'color',
          default: {
            mapping: false,
            fixed: '#CB6EF8',
            scale: {
              type: 'ordinal',
              scheme: 'cat-1',
              custom: true,
              excepted: '#666',
              abnormal: '#f31200',
              pin: [false, true],
            },
          },
        },
        keyMapping: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          showInPanel: {
            conditions: [['color.mapping', '$eq', true]],
          },
          valuePath: 'color.key',
          options,
        },
      },
    },

    label: {
      name: '标签',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        showlabel: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
        fill: {
          name: '颜色',
          type: 'fill',
          default: '#333',
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
        },
        keyLabel: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          valuePath: 'label.key',
          showInPanel: {
            conditions: [['label.showlabel', '$eq', true]],
          },
          options,
        },
      },
    },
  };
};

export default registerMeta;
