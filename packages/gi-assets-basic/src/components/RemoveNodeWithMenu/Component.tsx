import { useContext } from '@antv/gi-sdk';
import React from 'react';
import { Menu } from 'antd';
import { useCallback } from 'react';
import useRemove from './useRemove';
export interface IProps {
  contextmenu: any;
}
const NodeRemoveMenuItem: React.FunctionComponent<IProps> = (props) => {
  const { contextmenu} = props;
  const { graph } = useContext();
  const { removeNodes } = useRemove();
  const handleClick = useCallback(() => {
    contextmenu?.onClose();
    if (contextmenu?.item) {
      graph.setItemState(contextmenu.item, 'selected', true);
    }
    const nodeIds = (graph.findAllByState('node', 'selected') || []).map(n => n.getID())
    removeNodes(nodeIds);
  }, [removeNodes, contextmenu, graph]);
  return (
    <Menu.Item key="node-remove" eventKey="node-remove" onClick={handleClick}>
      删除节点
    </Menu.Item>
  );
};

export default NodeRemoveMenuItem;
