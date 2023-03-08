import { useContext } from '@antv/gi-sdk';
import React from 'react';
import { Menu } from 'antd';
import type { ContextMenuValue } from '@antv/graphin';
import { GraphData } from '@antv/g6';

export interface IProps {
  contextmenu: ContextMenuValue;
}

const SelectExchangeMenuItem: React.FunctionComponent<IProps> = props => {
  const { contextmenu } = props;
  const { graph } = useContext();

  // 输入当前被选择的节点，实现 节点+边 的反选效果
  const exchangeSelectContents = React.useCallback((nodeIds: any[]) => {
    const graphData = graph.save() as GraphData;
    const selectedNodeMap: any = {};
    // 遍历所有节点。清空状态 + 将每个节点的“selected状态”设置为相反值
    graphData.nodes?.forEach((n: any) => {
      graph.clearItemStates(n.id!);
      const finalStatus = !nodeIds.includes(n.id!) ;
      if(finalStatus){
        selectedNodeMap[n.id!] = n;
      }
      graph.setItemState(n.id!, 'selected', finalStatus);
    });
    // 遍历所有边。清空状态 + 当source和target对应的节点都被选中时，边被选中
    graphData.edges?.forEach((edge) => {
      graph.clearItemStates(edge.id!);
      let finalStatus = selectedNodeMap[edge.source!] && selectedNodeMap[edge.target!];
      graph.setItemState(edge.id!, 'selected', !!finalStatus);
    });
  },[graph]);

  const handleClick = React.useCallback(() => {
    contextmenu?.onClose();
    if (contextmenu?.item) {
      graph.setItemState(contextmenu.item, 'selected', true);
    }
    const nodeIds = (graph.findAllByState('node', 'selected') || []).map(n => n.getID());
    exchangeSelectContents(nodeIds)
  }, [contextmenu, graph]);

  return (
    <Menu.Item key="select-exchange" eventKey="select-exchange" onClick={handleClick}>
      反选节点
    </Menu.Item>
  )
};

export default SelectExchangeMenuItem;
