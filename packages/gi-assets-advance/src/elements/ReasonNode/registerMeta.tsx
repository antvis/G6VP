const registerMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });

  return {
    size: {
      name: '大小',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        sizeMapping: {
          name: '半径',
          type: 'sizeMapping',
          min: 0,
          max: 100,
          step: 1,
          suffix: 'px',
          valuePath: 'size',
          default: {
            mapping: false,
            fixed: 26,
            scale: {
              custom: false, // 是否采取自定义映射
              range: [3, 30], // 值域
              domain: [0, 1000], // 定义域
              abnormal: 1,
            },
          },
        },
        keyMapping: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'amount',
          options,
          showInPanel: {
            conditions: [['size.mapping', '$eq', true]],
          },
          valuePath: 'size.key',
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
              range: [
                '#CB6EF8',
                '#82E6C7',
                '#F6D87B',
                '#F69F7F',
                '#E96075',
                '#F58CCB',
                '#795AE1',
                '#622CD8',
                '#85C98E',
                '#3E34E5',
                '#2959C1',
                '#4D92DE',
                '#5CB5D4',
                '#B9D569',
              ],
              domain: [],
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
            conditions: [
              ['color.scale.custom', '$eq', true],
              ['color.mapping', '$eq', true],
            ],
            logicalType: '$and',
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
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
        key: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
          options,
        },
        color: {
          name: '颜色',
          type: 'fill',
          default: '#000',
          valuePath: 'label.color',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
    icon: {
      name: '图标',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          type: 'switch',
          name: '开关',
          statusText: true,
          default: true,
        },
        type: {
          name: '类型',
          type: 'buttonRadio',
          useFont: true,
          default: 'text',
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
          options: [
            {
              value: 'text',
              label: '文本',
            },
            {
              value: 'image',
              label: '图片',
            },
            {
              value: 'font',
              label: '字体图标',
            },
          ],
        },
        key: {
          name: '映射字段',
          type: 'select',
          default: 'id',
          options,
          showInPanel: {
            conditions: [['.enable', '$eq', true]],
          },
        },
      },
    },
  };
};

export default registerMeta;
