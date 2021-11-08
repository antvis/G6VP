/** 3.根据Transform函数里的数据，即draw函数里的cfg */
const registerShape = Graphin => {
  Graphin.registerNode('RectNode', {
    options: {
      style: {},
      stateStyles: {
        hover: {},
        selected: {},
      },
    },
    draw(cfg, group) {
      const { size, color, label } = cfg;
      const { labelCfg } = cfg.style;
      const keyshape = group.addShape('rect', {
        attrs: {
          id: 'circle-floor',
          x: 0,
          y: 0,
          width: size,
          height: size,
          fill: color,
        },
        draggable: true,
        name: 'circle-floor',
      });
      group.addShape('text', {
        attrs: {
          fontSize: 12,
          x: 0,
          y: 0,
          text: label,
          fill: labelCfg.color,
        },
        draggable: true,
        name: 'text',
      });
      return keyshape;
    },
  });
};

export default registerShape;
