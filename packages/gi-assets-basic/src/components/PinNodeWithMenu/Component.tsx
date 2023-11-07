import { useContext } from '@antv/gi-sdk';
import { Menu } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import $i18n from '../../i18n';
import { handlePinNode, handleUnPinNode } from '../common/handlePinNode';

// import { INode } from '@antv/g6';

const hasPinned = nodeModel => nodeModel?.data.__style?.badgeShapes?.find(badge => badge.name === 'pin');
export interface PinNodeMenuItemProps {
  contextmenu: any;
  controlledValues?: {
    id: string;
    action: 'pin' | 'unpin';
  };
}

const PinNodeMenuItem: React.FunctionComponent<PinNodeMenuItemProps> = props => {
  const { contextmenu, controlledValues } = props;
  const { graph, context, updateHistory } = useContext();
  const { layout } = context;
  const { type } = layout.props;
  const isForce = type === 'graphin-force' || type === 'force' || type === 'd3force';

  const [pinned, setPinned] = useState(false);

  const targetNode = contextmenu.item;

  const handleLockNode = (propId?: string, action?: 'pin' | 'unpin') => {
    let { id } = contextmenu.item;
    // 仅支持对节点的操作
    const invalidFromContextMenu = !graph.getNodeData(id);
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

    let pinAction;
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
      pinAction = action || 'pin';
    } else {
      const model = graph.getNodeData(id);
      const pinned = hasPinned(model);
      pinAction = pinned ? 'unpin' : 'pin';
      setPinned(pinned);
    }
    if (pinAction === 'unpin') {
      handleUnPinNode(id, graph);
    } else {
      handlePinNode(id, graph, { dragNodeMass: 1000 });
    }
    if (isForce) {
      graph.layout({
        type,
        animated: true,
        presetLayout: {},
      });
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
      {hasPinned(targetNode)
        ? $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.Unfix', dm: '解除固定' })
        : $i18n.get({ id: 'basic.components.PinNodeWithMenu.Component.FixedNode', dm: '固定节点' })}
    </Menu.Item>
  );
};

export default memo(PinNodeMenuItem);
