const registerMeta = context => {
  return {
    stiffness: {
      type: 'slider',
      caption: '边作用力',
      min: 1,
      max: 500,
      step: 1,
      default: 200,
    },
    repulsion: {
      type: 'slider',
      caption: '节点作用力',
      min: -100,
      max: 2000,
      step: 10,
      default: 1000,
    },
    damping: {
      type: 'slider',
      caption: '阻尼系数',
      default: 0.9,
      step: 0.1,
      min: 0,
      max: 1,
    },
    MaxIterations: {
      type: 'slider',
      caption: '最大迭代数',
      default: 10000,
      min: 1000,
      max: 20000,
      step: 100,
    },
    animation: {
      type: 'switch',
      caption: '是否开启动画',
      default: true,
      statusText: false,
    },
  };
};

export default registerMeta;
