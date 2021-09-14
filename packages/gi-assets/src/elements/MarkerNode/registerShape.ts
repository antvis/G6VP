const registerShape = Graphin => {
  // 矩形节点
  Graphin.registerNode('rectangle', {
    options: {
      style: {},
      stateStyles: {
        hover: {},
        selected: {},
      },
    },
    draw(cfg, group) {
      const { text = {}, shape = {} } = cfg.style;
      const keyshape = group.addShape('rect', {
        attrs: {
          id: 'rect',
          x: 0,
          y: 0,
          width: 30,
          height: 30,
          fill: shape.fill,
        },
        draggable: true,
        name: 'rect',
      });
      group.addShape('text', {
        attrs: {
          fontSize: 12,
          x: 15,
          y: 15,
          text: text.value,
          fill: text.fill,
          textAlign: 'center',
          textBaseline: 'middle',
        },
        draggable: true,
        name: 'text',
      });
      return keyshape;
    },
  });

  //   圆形节点
  Graphin.registerNode('circle', {
    options: {
      style: {},
      stateStyles: {
        hover: {},
        selected: {},
      },
    },
    draw(cfg, group) {
      const { text = {}, shape = {} } = cfg.style;
      const keyshape = group.addShape('circle', {
        attrs: {
          id: 'circle',
          x: 0,
          y: 0,
          r: 15,
          fill: shape.fill,
        },
        draggable: true,
        name: 'circle',
      });
      group.addShape('text', {
        attrs: {
          fontSize: 12,
          x: 0,
          y: 0,
          text: text.value,
          fill: text.fill,
          textAlign: 'center',
          textBaseline: 'middle',
        },
        draggable: true,
        name: 'text',
      });
      return keyshape;
    },
  });
};
export default registerShape;
