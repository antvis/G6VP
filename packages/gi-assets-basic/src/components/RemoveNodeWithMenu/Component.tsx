import { useContext } from '@antv/gi-sdk';
import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { useCallback } from 'react';
import useRemove from './useRemove';
import $i18n from '../../i18n';
export interface IProps {
  contextmenu: any;
  controlledValues?: {
    nodeIds: string[];
  };
}
const NodeRemoveMenuItem: React.FunctionComponent<IProps> = props => {
  const { contextmenu, controlledValues } = props;
  const { graph, updateHistory } = useContext();
  const { removeNodes } = useRemove();
  const handleClick = useCallback(() => {
    contextmenu?.onClose();
    if (contextmenu?.item) {
      graph.setItemState(contextmenu.item, 'selected', true);
    }
    const nodeIds = (graph.findAllByState('node', 'selected') || []).map(n => n.getID());
    removeNodes(nodeIds);
    handleUpateHistory(nodeIds);
  }, [removeNodes, contextmenu, graph]);

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory = (nodeIds: string[], success: boolean = true, errorMsg?: string) => {
    updateHistory({
      componentId: 'RemoveNodeWithMenu',
      type: 'configure',
      subType: $i18n.get({ id: 'basic.components.RemoveNodeWithMenu.Component.DeleteANode', dm: '删除节点' }),
      statement: $i18n.get(
        {
          id: 'basic.components.RemoveNodeWithMenu.Component.DeleteNodeidslengthNodes',
          dm: '删除 {nodeIdsLength} 个节点',
        },
        { nodeIdsLength: nodeIds.length },
      ),
      success,
      errorMsg,
      params: {
        nodeIds,
      },
    });
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { nodeIds } = controlledValues;
      const existIds = nodeIds.filter(id => graph.findById(id));
      if (!existIds.length) {
        handleUpateHistory(
          [],
          false,
          $i18n.get({
            id: 'basic.components.RemoveNodeWithMenu.Component.TheNodeWithTheSpecified',
            dm: '当前画布中未找到指定 id 的节点',
          }),
        );
      } else {
        removeNodes(existIds);
        handleUpateHistory(existIds);
      }
    }
  }, [controlledValues]);

  return (
    <Menu.Item key="node-remove" eventKey="node-remove" onClick={handleClick}>
      {$i18n.get({ id: 'basic.components.RemoveNodeWithMenu.Component.DeleteANode', dm: '删除节点' })}
    </Menu.Item>
  );
};

export default NodeRemoveMenuItem;
