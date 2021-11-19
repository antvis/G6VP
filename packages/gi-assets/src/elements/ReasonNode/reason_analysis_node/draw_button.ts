// 绘制小按钮
export default function drawButton(group: any /* data: any = {} */) {
  const radius_base = 16;
  const buble_raduis = 5;
  const center = { x: radius_base, y: 0 };

  group.addShape('circle', {
    attrs: {
      x: center.x,
      y: center.y,
      r: buble_raduis,
      fill: '#ffffff44',
    },
  });

  const icon_width = 5;
  const icon_height = 1.4;
  group.addShape('rect', {
    attrs: {
      width: icon_width,
      height: icon_height,
      x: center.x - icon_width / 2,
      y: center.y - icon_height / 2,
      fill: 'white',
      radius: 1,
    },
  });
}
