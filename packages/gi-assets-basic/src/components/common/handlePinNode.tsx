import { IGraph, icons } from '@antv/gi-sdk';

export const handlePinNode = (itemId, graph, params) => {
  const { x, y, color, dragNodeMass } = params || {};

  try {
    const pinBadge = {
      text: icons.pushpin,
      position: 'leftBottom',
      color,
      fontFamily: 'iconfont',
      name: 'pin',
    };
    graph.updateNodePosition(
      [
        {
          id: itemId,
          data: {
            x,
            y,
          },
        },
      ],
      true,
      true,
    );

    const { badgeShapes = [] } = graph.getNodeData(itemId)?.data || {};
    if (!badgeShapes.find(badge => badge.name === 'pin')) {
      badgeShapes.push(pinBadge);
      graph.updateData('node', {
        id: itemId,
        data: {
          mass: dragNodeMass,
          __style: {
            badgeShapes,
          },
        },
      });
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const handleUnPinNode = (target, graph: IGraph, restartForceSimulation, isForce) => {
  try {
    const model = target.getModel();
    // 目前仅支持GraphinNode 节点
    const isGraphinNode = model.type === 'graphin-circle';
    if (!isGraphinNode) {
      return;
    }
    const style = model.style || { badges: [] };
    const badges = [...style.badges];
    const index = badges.findIndex(({ value }) => value === icons.pushpin);
    badges.splice(index, 1);
    // 更改样式
    graph.updateItem(model.id, {
      layout: {
        ...model.layout,
        force: { mass: null },
      },
      mass: 1,
      pinned: false,
      style: {
        badges,
      },
    });

    // 重启力导
    if (isForce) {
      restartForceSimulation([model], graph);
    }
  } catch (error) {
    console.log(error);
  }
};
