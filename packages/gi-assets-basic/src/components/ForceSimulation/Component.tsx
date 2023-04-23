import React from 'react';
import { handlePinNode } from '../common/handlePinNode';

import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';

const { GIAComponent, deepClone } = extra;

export interface IProps {
  GIAC: IGIAC;
  autoPin: boolean;
  dragNodeMass: number;
}

const ForceSimulation: React.FunctionComponent<IProps> = props => {
  const GIAC = deepClone(props.GIAC);
  const { graph, layoutInstance, layout, restartForceSimulation, stopForceSimulation } = useContext();

  const isForce = layout.type === 'graphin-force' || layout.type === 'force2';

  const handleClick = () => {
    if (isForce) {
      restartForceSimulation([]);
    }
  };

  const { autoPin, dragNodeMass = 10000000000 } = props;

  React.useEffect(() => {
    const handleNodeDragStart = () => {
      if (!isForce) {
        return;
      }
      stopForceSimulation();
    };
    const handleNodeDragEnd = (e: any) => {
      if (!isForce || !autoPin) {
        return;
      }
      if (e.item) {
        handlePinNode(e.item, graph, restartForceSimulation, {
          dragNodeMass,
          x: e.x,
          y: e.y,
          isForce,
        });
      }
    };

    graph.on('node:dragstart', handleNodeDragStart);
    graph.on('node:dragend', handleNodeDragEnd);
    graph.on('canvas:click', handleNodeDragStart);
    return () => {
      graph.off('node:dragstart', handleNodeDragStart);
      graph.off('node:dragend', handleNodeDragEnd);
      graph.off('canvas:click', handleNodeDragStart);
    };
  }, [graph, autoPin, isForce, layoutInstance, restartForceSimulation]);

  GIAC.icon = 'icon-play-circle';
  GIAC.disabled = true;
  GIAC.tooltip = '该功能仅在力导布局下才可使用';
  if (isForce) {
    GIAC.disabled = false;
    GIAC.tooltip = '重启力导布局，点击画布可以暂停力导';
  }

  return <GIAComponent GIAC={GIAC} onClick={handleClick} />;
};

export default ForceSimulation;
