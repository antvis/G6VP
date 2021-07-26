const getMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });

  return {
    label: {
      name: '标签',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        visible: {
          name: '显隐',
          type: 'switch',
          default: true,
          statusText: true,
        },
        value: {
          name: '映射字段',
          type: 'select',
          useFont: true,
          default: 'type',
          options,
        },
        position: {
          name: '位置',
          type: 'buttonRadio',
          default: 'bottom',
          options: [
            {
              value: 'left',
              label: '左侧',
            },
            {
              value: 'right',
              label: '右侧',
            },
            {
              value: 'center',
              label: '中间',
            },
            {
              value: 'top',
              label: '上侧',
            },
            {
              value: 'bottom',
              label: '下侧',
            },
          ],
        },
        fill: {
          name: '颜色',
          type: 'fill',
          default: '#333',
        },
        fontSize: {
          name: '大小',
          type: 'sizeMapping',
          min: 0,
          max: 50,
          step: 1,
          suffix: 'px',
          default: {
            mapping: true,
            fixed: 12,
            scale: {
              custom: false, // 是否采取自定义映射
              range: [3, 30], // 值域
              domain: [0, 1000], // 定义域
              abnormal: 1,
            },
          },
        },
      },
    },
    keyshape: {
      name: '形状',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        fill: {
          name: '颜色',
          type: 'fill',
          default: '#333',
        },
        size: {
          name: '大小',
          type: 'sizeMapping',
          min: 0,
          max: 50,
          step: 1,
          suffix: 'px',
          default: {
            mapping: true,
            fixed: 12,
            scale: {
              custom: true, // 是否采取自定义映射
              range: [3, 30], // 值域
              domain: [0, 1000], // 定义域
              abnormal: 1,
            },
          },
        },
      },
    },
  };
};

export default getMeta;
