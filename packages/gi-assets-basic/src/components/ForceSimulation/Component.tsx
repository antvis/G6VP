import iconLoader from '@antv/graphin-icons';
import React from 'react';
import { handlePinNode } from '../common/handlePinNode';

// @ts-ignore
const icons = Graphin.registerFontFamily(iconLoader);

import type { IGIAC } from '@alipay/graphinsight';
import { extra, useContext } from '@alipay/graphinsight';

const { GIAComponent, deepClone } = extra;

export interface IProps {
  GIAC: IGIAC;
  autoPin: boolean;
  dragNodeMass: number;
}

const ForceSimulation: React.FunctionComponent<IProps> = props => {
  const GIAC = deepClone(props.GIAC);
  const { graph, layoutInstance, layout } = useContext();
  const [state, setState] = React.useState({
    toggle: false,
  });
  const { toggle } = state;

  const isForce = layout.type === 'graphin-force';

  const handleClick = () => {
    const { instance = {} } = layoutInstance || {};
    const { simulation } = instance;

    if (isForce && simulation) {
      if (!toggle) {
        simulation.stop();
      } else {
        simulation.restart([], graph);
      }
      setState({
        ...state,
        toggle: !toggle,
      });
    }
  };

  const { autoPin, dragNodeMass = 10000000000 } = props;

  React.useEffect(() => {
    const handleNodeDragStart = () => {
      const { instance = {} } = layoutInstance || {};
      const { simulation } = instance;
      if (simulation) {
        simulation.stop();
      }
    };
    const handleNodeDragEnd = (e: any) => {
      if (!isForce || !autoPin) {
        return;
      }
      if (e.item) {
        console.log('doing...');
        handlePinNode(e.item, graph, layoutInstance, {
          dragNodeMass,
          x: e.x,
          y: e.y,
        });
      }
    };

    graph.on('node:dragstart', handleNodeDragStart);
    graph.on('node:dragend', handleNodeDragEnd);
    return () => {
      graph.off('node:dragstart', handleNodeDragStart);
      graph.off('node:dragend', handleNodeDragEnd);
    };
  }, [graph, autoPin, isForce, layoutInstance]);

  GIAC.icon = toggle ? 'icon-play-circle' : 'icon-pause';
  GIAC.disabled = true;
  GIAC.tooltip = '该功能仅在力导布局下才可使用';
  if (isForce) {
    GIAC.disabled = false;
    GIAC.tooltip = toggle ? '重启力导布局' : '暂停力导布局';
  }

  return <GIAComponent GIAC={GIAC} onClick={handleClick} />;
};

export default ForceSimulation;
