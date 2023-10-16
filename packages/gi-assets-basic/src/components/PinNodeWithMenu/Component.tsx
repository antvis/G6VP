import { useContext } from '@antv/gi-sdk';
import { Menu } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import $i18n from '../../i18n';
import { handlePinNode, handleUnPinNode } from '../common/handlePinNode';

// import { INode } from '@antv/g6';
type INode = any;

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

  const targetNode = contextmenu.item;

  const handleLockNode = (propId?: string, action?: 'pin' | 'unpin') => {
    const target = contextmenu.item;
    // 仅支持对节点的操作
    const invalidFromContextMenu = !target || target.destroyed || target.getType?.() !== 'node';
    if (invalidFromContextMenu && !propId) {
      handleUpateHistory(
        undefined,
        undefined,
        false,
        $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.TheNodeDoesNotExist', dm: '节点不存在' }),
      );
      return null;
    }
    contextmenu.onClose();

    let item;
    let pinAction;
    let id;
    if (propId) {
      if (!graph.findById(propId)) {
        handleUpateHistory(
          undefined,
          undefined,
          false,
          $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.TheNodeDoesNotExist', dm: '节点不存在' }),
        );
        return;
      }
      id = propId;
      item = graph.findById(propId);
      pinAction = action || 'pin';
    } else {
      item = target;
      const model = target.getModel();
      id = model.id;
      pinAction = model.pinned ? 'unpin' : 'pin';
      setPinned(model.pinned);
    }
    if (pinAction === 'unpin') {
      handleUnPinNode(item, graph, restartForceSimulation, isForce);
    } else {
      handlePinNode(item, graph, restartForceSimulation, { dragNodeMass: 100000, isForce });
    }
    handleUpateHistory(id, pinAction, true);
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
      subType: $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.FixedNode', dm: '固定节点' }),
      statement: $i18n.get(
        {
          id: 'basic.components.PinNodeWithMenu.Component.FixedId',
          dm: '固定 {id}',
        },
        { id: id },
      ),
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
    // if (controlledValues) {
    //   const { id, action } = controlledValues;
    //   setTargetNode(graph.findById(id) as INode);
    //   handleLockNode(id, action);
    // }
  }, [controlledValues]);

  if (!targetNode || targetNode.destroyed) return null;

  return (
    <Menu.Item key="lock-node" eventKey="lock-node" onClick={() => handleLockNode()}>
      {targetNode.pinned
        ? $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.Unfix', dm: '解除固定' })
        : $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.FixedNode', dm: '固定节点' })}
    </Menu.Item>
  );
};

export default memo(PinNodeMenuItem);
