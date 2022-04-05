import { INode } from '@antv/g6';
import * as React from 'react';
import { Menu } from 'antd';
import { useContext } from '@alipay/graphinsight';
import type { Contextmenu } from '../ContextMenu';
import { filterGraphDataByNodes, getLeafNodes } from '../utils';

export interface IProps {
  contextmenu: Contextmenu;
  isReLayout: boolean;
  degree: number;
}

// 叶子节点缓存
const leafNodeIdsCache: Record<string, string[]> = {};
// 处于收起状态的节点
const foldedNodes = new Set<INode>();
// 原始画布数据
let originGraphData;

const ToggleClusterWithMenu: React.FunctionComponent<IProps> = props => {
  const { contextmenu, isReLayout, degree } = props;
  const { graph, updateData, data } = useContext();
  const { item: targetNode, id: nodeId, onClose } = contextmenu;
  const model = targetNode.getModel();
  if (!originGraphData) {
    originGraphData = data;
  }

  const handleToggleCluster = () => {
    // n 度节点收起暂不支持
    if (degree === 1) {
      const leafNodeIds = getLeafNodes(targetNode).map(node => node.getModel().id as string);
      if (model.folded) {
        graph.updateItem(targetNode, {
          folded: false,
        });
        leafNodeIds.forEach(id => {
          graph.showItem(id);
        });
      } else {
        leafNodeIds.forEach(id => {
          graph.hideItem(id);
        });
        foldedNodes.add(targetNode);
        leafNodeIdsCache[nodeId] = leafNodeIds;
        graph.updateItem(targetNode, {
          folded: true,
        });
      }

      if (isReLayout) {
        let hiddenNodeIds: string[] = [];
        Array.from(foldedNodes).forEach(node => {
          if (node.getModel().folded) {
            const id = node.getModel().id as string;
            hiddenNodeIds = [...hiddenNodeIds, ...leafNodeIdsCache[id]];
          }
        });
        const newData = filterGraphDataByNodes(originGraphData, hiddenNodeIds);
        updateData(newData);
      }
    }
    onClose();
  };

  return (
    <Menu.Item key="toggleClusterWithMenu" onClick={handleToggleCluster}>
      {model.folded ? '展开' : '收起'}
    </Menu.Item>
  );
};

export default ToggleClusterWithMenu;
