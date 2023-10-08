const transGraphinStyle = style => {
  const { keyshape = {}, halo = {}, icon = {}, label = {}, badges = [] } = style || {};

  return {
    type: 'line-edge',
    keyShape: {
      opacity: 0.6, // 边主图形的透明度
      stroke: 'grey', // 边主图形描边颜色
    },
    // 边上的标签文本配置
    labelShape: {
      autoRotate: true, // 边上的标签文本根据边的方向旋转
    },
    // 边的动画配置
    // animates: {
    //   // 数据/状态更新时
    //   update: [
    //     {
    //       shapeId: 'haloShape', // 背景光晕图形
    //       states: ['selected', 'active'], // 在 selected 和 active 状态变更时
    //     },
    //     {
    //       shapeId: 'keyShape', // 主图形
    //       states: ['selected', 'active'], // 在 selected 和 active 状态变更时
    //     },
    //   ],
    // },
  };
};

export const edgeStyleTransform = edge => {
  const { style, type, id, data, source, target } = edge;
  const IS_GRAPHIN = (style && type === 'graphin-line') || !type;
  // console.log('edge', edge);
  if (IS_GRAPHIN) {
    return {
      source,
      target,
      id: id || `${source}-${target}-${Math.random()}`,
      data: {
        ...data,
        ...transGraphinStyle(style),
      },
    };
  }
  return edge;
};
