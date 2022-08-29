import { useContext } from '@alipay/graphinsight';
import { Menu } from 'antd';
import React from 'react';

import { handlePinNode, handleUnPinNode } from '../common/handlePinNode';

export interface PinNodeMenuItemProps {
  contextmenu: any;
}

const PinNodeMenuItem: React.FunctionComponent<PinNodeMenuItemProps> = props => {
  const { contextmenu } = props;
  const { graph, layout, restartForceSimulation } = useContext();
  const target = contextmenu.item;
  if (!target || target.destroyed) {
    return null;
  }
  const model = target.getModel();
  const { pinned } = model;
  const isForce = layout.type === 'graphin-force';

  const handleLockNode = () => {
    contextmenu.onClose();
    if (pinned) {
      handleUnPinNode(target, graph, restartForceSimulation, isForce);
    } else {
      handlePinNode(target, graph, restartForceSimulation, { dragNodeMass: 100000, isForce });
    }
  };

  return (
    <Menu.Item key="lock-node" eventKey="lock-node" onClick={handleLockNode}>
      {pinned ? '解除固定' : '固定节点'}
    </Menu.Item>
  );
};

export default PinNodeMenuItem;
