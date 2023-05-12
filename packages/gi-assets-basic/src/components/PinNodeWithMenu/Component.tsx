import { useContext } from '@antv/gi-sdk';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';

import { handlePinNode, handleUnPinNode } from '../common/handlePinNode';

export interface PinNodeMenuItemProps {
  contextmenu: any;
  controlledValues?: {
    id: string;
    action: 'pin' | 'unpin';
  };
}

const PinNodeMenuItem: React.FunctionComponent<PinNodeMenuItemProps> = props => {
  const { contextmenu, controlledValues } = props;
  const { graph, layout, restartForceSimulation, updateHistory } = useContext();
  const isForce = layout.type === 'graphin-force';

  const [pinned, setPinned] = useState(false);

  const handleLockNode = (id?: string, action?: 'pin' | 'unpin') => {
    const target = contextmenu.item;
    // 仅支持对节点的操作
    const invalidFromContextMenu = !target || target.destroyed || target.getType?.() !== 'node';
    if (invalidFromContextMenu || !id) {
      handleUpateHistory(undefined, undefined, false, '节点不存在');
      return null;
    }
    const model = target.getModel();
    const { pinned: nodePinned } = model;
    setPinned(nodePinned);

    contextmenu.onClose();

    let item = target;
    let pinAction = nodePinned ? 'unpin' : 'pin';
    if (id) {
      if (graph.findById(id)) {
        handleUpateHistory(undefined, undefined, false, '节点不存在');
      } else {
        item = graph.findById(id);
      }
      pinAction = action || 'pin';
    }
    if (pinAction === 'unpin') {
      handleUnPinNode(item, graph, restartForceSimulation, isForce);
    } else {
      handlePinNode(item, graph, restartForceSimulation, { dragNodeMass: 100000, isForce });
    }
    handleUpateHistory(id || model.id, nodePinned ? 'unpin' : 'pin', true);
  };
  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory = (id?: string, action?: 'pin' | 'unpin', success: boolean = true, errorMsg?: string) => {
    updateHistory({
      componentId: 'PinNodeWithMenu',
      type: 'configure',
      subType: '固定节点',
      statement: `固定 ${id}`,
      success,
      errorMsg,
      params: { id, action },
    });
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { id, action } = controlledValues;
      handleLockNode(id, action);
    }
  }, [controlledValues]);

  return (
    <Menu.Item key="lock-node" eventKey="lock-node" onClick={() => handleLockNode()}>
      {pinned ? '解除固定' : '固定节点'}
    </Menu.Item>
  );
};

export default PinNodeMenuItem;
