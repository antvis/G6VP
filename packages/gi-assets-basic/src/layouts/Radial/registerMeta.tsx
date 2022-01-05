const registerMeta = context => {
  return {
    unitRadius: {
      type: 'slider',
      caption: '层级距离',
      default: 100,
      min: 1,
      max: 500,
      step: 1,
    },
    focusNode: {
      type: 'text',
      caption: '中心节点',
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
  };
};

export default registerMeta;
