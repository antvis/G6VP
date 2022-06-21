import iconLoader from '@antv/graphin-icons';
// @ts-ignore
const icons = Graphin.registerFontFamily(iconLoader);

export const handlePinNode = (target, graph, layoutInstance, params) => {
  const { x, y, dragNodeMass } = params || {};
  const { instance = {} } = layoutInstance || {};
  const { simulation, type } = instance;
  const isForce = type === 'graphin-force' && simulation;
  const model = target.getModel();
  const style = model.style || { badges: [] };
  const { keyshape, icon } = style;
  const badges = [...style.badges];
  const index = badges.findIndex(({ value }) => value === icons.pushpin);
  badges.splice(index, 1); //   delete default pin badge

  badges.push({
    position: 'LB',
    fontFamily: 'graphin',
    type: 'font',
    value: icons.pushpin,
    size: [15, 15],
    color: keyshape.fill,
    fill: icon.fill,
    stroke: keyshape.fill,
  });

  // update style
  graph.updateItem(target, {
    pinned: true,
    style: {
      badges,
    },
  });
  //  如果是力导，需要重新启动
  if (isForce) {
    const model = target.get('model');
    const position = x &&
      y && {
        x,
        y,
      };
    const newModel = {
      ...model,
      ...position,
      pinned: true,
      forceMass: dragNodeMass,
      layout: {
        force: {
          ...model.force,
          mass: dragNodeMass,
        },
      },
    };
    // 重启力导
    simulation.restart([newModel], graph);
  }
};

export const handleUnPinNode = (target, graph, layoutInstance) => {
  const { instance = {} } = layoutInstance || {};
  const { simulation, type } = instance;
  const isForce = type === 'graphin-force' && simulation;
  const model = target.getModel();
  const style = model.style || { badges: [] };
  const badges = [...style.badges];
  const index = badges.findIndex(({ value }) => value === icons.pushpin);
  badges.splice(index, 1);
  // 更改样式
  graph.updateItem(model.id, {
    layout: {
      ...model.layout,
      force: { mass: 1 },
    },
    pinned: false,
    style: {
      badges,
    },
  });
  // 重启力导
  if (isForce) {
    simulation.restart([model], graph);
  }
};
