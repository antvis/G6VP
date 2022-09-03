import { useContext } from '@alipay/graphinsight';
import type { ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import * as React from 'react';
import { filterGraphDataByNodes, getLeafNodes } from '../utils';

export interface IProps {
  contextmenu: ContextMenuValue;
  isReLayout: boolean;
  degree: number;
}

// 叶子节点缓存
const leafNodeIdsCache: Record<string, string[]> = {};
// 已被操作过的节点缓存
const nodeIdsCache = new Set<string>();

const ToggleClusterWithMenu: React.FunctionComponent<IProps> = props => {
  const { contextmenu, isReLayout, degree } = props;
  const { graph, updateContext, source, data } = useContext();
  const { item: targetNode, id: nodeId, onClose } = contextmenu;
  if (!targetNode || targetNode.destroyed) {
    return null;
  }
  const model = targetNode.getModel();

  const handleToggleCluster = () => {
    // n 度节点收起暂不支持
    if (degree === 1) {
      //@ts-ignore
      const leafNodeIds = getLeafNodes(targetNode).map(node => node.getModel().id as string);
      if (model.folded) {
        //@ts-ignore
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
        nodeIdsCache.add(nodeId);
        leafNodeIdsCache[nodeId] = leafNodeIds;
        //@ts-ignore
        graph.updateItem(targetNode, {
          folded: true,
        });
      }

      if (isReLayout) {
        let hiddenNodeIds: string[] = [];
        Array.from(nodeIdsCache).forEach(id => {
          const node = graph.findById(id);
          if (node && node.getModel().folded) {
            const id = node.getModel().id as string;
            hiddenNodeIds = [...hiddenNodeIds, ...leafNodeIdsCache[id]];
          }
        });
        const newData = filterGraphDataByNodes(source, hiddenNodeIds);
        updateContext(draft => {
          draft.data = newData;
        })
      }
    }
    onClose();
  };

  return (
    <Menu.Item key="toggleClusterWithMenu" onClick={handleToggleCluster}>
      {model.folded ? '展开节点' : '收起节点'}
    </Menu.Item>
  );
};

export default ToggleClusterWithMenu;
