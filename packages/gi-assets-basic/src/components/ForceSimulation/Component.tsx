import React, { memo } from 'react';
import { handlePinNode } from '../common/handlePinNode';

import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import $i18n from '../../i18n';

const { GIAComponent, deepClone } = extra;

export interface IProps {
  GIAC: IGIAC;
  autoPin: boolean;
  dragNodeMass: number;
  pinColor: '#7E92B5';
}

const ForceSimulation: React.FunctionComponent<IProps> = props => {
  const GIAC = deepClone(props.GIAC);
  const { graph, context } = useContext();
  const { layout } = context;
  const { type } = layout.props;
  const isForce = type === 'graphin-force' || type === 'force' || type === 'd3force';

  const handleClick = () => {
    if (isForce) {
      graph.layout({
        type: type,
        presetLayout: {},
      });
    }
  };

  const { autoPin, pinColor, dragNodeMass = 1000 } = props;

  React.useEffect(() => {
    const handleNodeDragStart = () => {
      if (!isForce) {
        return;
      }
      graph.stopLayout();
    };
    const handleNodeDragEnd = (e: any) => {
      if (!isForce || !autoPin) {
        return;
      }
      if (e.itemId) {
        handlePinNode(e.itemId, graph, {
          dragNodeMass,
          x: e.canvas.x,
          y: e.canvas.y,
          color: pinColor,
        });
        graph.layout({
          type,
          presetLayout: {},
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
  }, [graph, autoPin, isForce]);

  GIAC.icon = 'icon-play-circle';
  GIAC.disabled = true;
  GIAC.tooltip = $i18n.get({
    id: 'basic.components.ForceSimulation.Component.ThisFunctionCanOnlyBe',
    dm: '该功能仅在力导布局下才可使用',
  });
  if (isForce) {
    GIAC.disabled = false;
    GIAC.tooltip = $i18n.get({
      id: 'basic.components.ForceSimulation.Component.RestartTheForceGuideLayout',
      dm: '重启力导布局，点击画布可以暂停力导',
    });
  }

  return <GIAComponent GIAC={GIAC} onClick={handleClick} />;
};

export default memo(ForceSimulation);
