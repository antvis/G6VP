import { IGraph, icons } from '@antv/gi-sdk';

export const handlePinNode = (itemId, graph, params) => {
  const { x, y, color, dragNodeMass } = params || {};
  const nodeModel = graph.getNodeData(itemId);
  if (!nodeModel) return;

  try {
    const { x: ox, y: oy, __style } = nodeModel.data;
    const pinPosition = {
      x: isNaN(x) ? ox : x,
      y: isNaN(y) ? oy : y,
    };
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
          data: pinPosition,
        },
      ],
      true,
      true,
    );

    const { badgeShapes = [] } = __style || {};
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

export const handleUnPinNode = (itemId, graph: IGraph) => {
  try {
    //@ts-ignore
    const { badgeShapes = [] } = graph.getNodeData(itemId)?.data?.__style || {};
    const index = badgeShapes.findIndex(({ name }) => name === 'pin');
    if (index > -1) {
      badgeShapes.splice(index, 1);
      graph.updateData('node', {
        id: itemId,
        data: {
          mass: undefined,
          __style: {
            badgeShapes,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
