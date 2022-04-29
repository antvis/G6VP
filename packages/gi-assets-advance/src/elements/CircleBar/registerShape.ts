/**
 * refer: https://g6.antv.vision/zh/examples/item/customNode#barChart
 */
const getPath = (cx, cy, rs, re, startAngle, endAngle, clockwise) => {
  const flag1 = clockwise ? 1 : 0;
  const flag2 = clockwise ? 0 : 1;
  return [
    ['M', Math.cos(startAngle) * rs + cx, Math.sin(startAngle) * rs + cy],
    ['L', Math.cos(startAngle) * re + cx, Math.sin(startAngle) * re + cy],
    ['A', re, re, 0, 0, flag1, Math.cos(endAngle) * re + cx, Math.sin(endAngle) * re + cy],
    ['L', Math.cos(endAngle) * rs + cx, Math.sin(endAngle) * rs + cy],
    ['A', rs, rs, 0, 0, flag2, Math.cos(startAngle) * rs + cx, Math.sin(startAngle) * rs + cy],
    ['Z'],
  ];
};

const registerShape = Graphin => {
  // graphinNode 已经注册成功

  Graphin.registerNode('circle-bar', {
    draw(cfg, group) {
      /*
      G:
      Fan
      x: the circle center of the fan
      y: the circle center of the fan
      rs: inner radius
      re: outer radius
      startAngle: start angle
      endAngle: end angle
      clockwise: render clockwisely if it is true
    */
      try {
        const baseR = cfg.size || 30;
        let nowAngle = 0;
        const everyIncAngle = (2 * Math.PI * (360 / 5 / 5)) / 360;
        cfg.details.forEach(cat => {
          cat.values.forEach(item => {
            const re = item + baseR;
            const path0 = getPath(0, 0, baseR, item + baseR, nowAngle, (nowAngle += everyIncAngle), false);
            const fan = group.addShape('path', {
              attrs: {
                path: path0,
                stroke: 'darkgray',
                fill: cat.color,
              },
              name: 'path-shape',
            });
            // behavior animation
            fan.on('node:mouseenter', () => {
              fan.animate(
                {
                  re: re + 8,
                },
                {
                  repeat: false,
                  duration: 300,
                },
              );
            });
            fan.on('node:mouseleave', () => {
              fan.animate(
                {
                  re,
                },
                {
                  repeat: false,
                  duration: 300,
                },
              );
            });
            // set the name
            fan.set('name', 'littleCircle');
          });
        });
        group.addShape('circle', {
          attrs: {
            x: 0,
            y: 0,
            r: baseR,
            fill: cfg.centerColor,
            stroke: 'darkgray',
          },
          name: 'circle-shape',
        });
        if (cfg.label) {
          group.addShape('text', {
            attrs: {
              x: 0,
              y: 0,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.label,
              fill: cfg.labelColor || '#fff',
              stroke: cfg.labelColor || '#fff',
              fontStyle: 'bold',
            },
            name: 'text-shape',
          });
        }
        return group;
      } catch (error) {
        return group;
      }
    },
  });
};
export default registerShape;
