import { useContext } from '@alipay/graphinsight';
import iconLoader from '@antv/graphin-icons';
import { Menu } from 'antd';
import React from 'react';

import { handlePinNode, handleUnPinNode } from '../common/handlePinNode';
// @ts-ignore
const icons = Graphin.registerFontFamily(iconLoader);

export interface PinNodeMenuItemProps {
  contextmenu: any;
}

const PinNodeMenuItem: React.FunctionComponent<PinNodeMenuItemProps> = props => {
  const { contextmenu } = props;
  const { graph, layoutInstance } = useContext();
  const target = contextmenu.item;
  if (!target) {
    return null;
  }
  const model = target.getModel();
  const { pinned } = model;

  const handleLockNode = () => {
    contextmenu.onClose();
    if (pinned) {
      handleUnPinNode(target, graph, layoutInstance);
    } else {
      handlePinNode(target, graph, layoutInstance, { dragNodeMass: 100000 });
    }
  };

  return (
    <Menu.Item key="lock-node" eventKey="lock-node" onClick={handleLockNode}>
      {pinned ? '解除固定' : '固定节点'}
    </Menu.Item>
  );
};

export default PinNodeMenuItem;
