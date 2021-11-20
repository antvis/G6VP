const registerMeta = context => {
  const { data } = context;
  let keys = ['id', 'type'];
  try {
    keys = Object.keys((data.nodes[0] && data.nodes[0].data) || {});
  } catch (error) {}

  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    mappingKeys: {
      type: 'checkbox',
      name: '显示字段',
      options,
    },
    placement: {
      name: '位置',
      type: 'buttonRadio',
      default: 'top',
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
          value: 'top',
          label: '上侧',
        },
        {
          value: 'bottom',
          label: '下侧',
        },
      ],
    },
    hasArrow: {
      name: '箭头',
      type: 'switch',
      default: true,
      statusText: true,
    },
    background: {
      name: '背景色',
      type: 'fill',
      default: '#f8f9fb',
    },
    color: {
      name: '字体颜色',
      type: 'fill',
      default: '#f8f9fb',
    },
  };
};

export default registerMeta;
