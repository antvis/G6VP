import { useContext } from '@antv/gi-sdk';
import * as React from 'react';
import { intersectionWith, uniq, union } from 'lodash';
import { Menu, message } from 'antd';
import { useCallback } from 'react';
import { IEdge, INode } from '@antv/g6';
import { ContextMenuValue } from '@antv/graphin';

export interface IProps {
  contextmenu: ContextMenuValue;
  selectedStatus: string;
  activeStatus: string;
  hop: number;
}

interface Item {
  node: INode;
  visited: Set<INode>;
}

/**
 * 发现共同邻居
 * @param beginNodes 起始节点数组
 * @param hop 跳数
 */
function findCommonNeighbors(beginNodes: INode[], hop: number = 1): { nodes: Set<INode>; edges: Set<IEdge> } {
  // 存储从起点开始的每一分支在某一跳后到达的节点和访问过的节点
  const queue: Item[][] = beginNodes.map(node => [
    {
      node,
      visited: new Set([node]),
    },
  ]);
  while (hop > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const itemList = queue.shift()!.reduce((acc: Item[], curr: Item) => {
        uniq(
          curr.node.getNeighbors().filter(node => {
            // 避免分支上出现环
            return !curr.visited.has(node);
          }),
        ).forEach(node => {
          acc.push({
            node,
            visited: new Set([...Array.from(curr.visited), node]),
          });
        });
        return acc;
      }, []);

      // 如果有分支不能达到hop指定的跳数，则不存在共同邻居, 提前返回
      if (itemList.length === 0) {
        return { nodes: new Set(), edges: new Set() };
      }
      queue.push(itemList);
    }
    hop--;
  }

  // 将起点开始的每一分支在进行hop对应的跳数后到达的节点取交集
  const nodes: Set<INode> = new Set(
    intersectionWith(...queue, (itemA: Item, itemB: Item) => itemA.node === itemB.node).map(item => item.node),
  );
  // 收集起点到共同邻居节点之间的边
  const edges: Set<IEdge> = new Set();
  union(...queue).map(item => {
    if (nodes.has(item.node)) {
      let prevNode;
      item.visited.forEach(node => {
        if (!prevNode) {
          prevNode = node;
          return;
        }
        prevNode.getEdges().forEach(edge => {
          if (edge.getTarget() === node || edge.getSource() === node) {
            edges.add(edge);
          }
        });
        prevNode = node;
      });
    }
  });
  return { nodes, edges };
}

const CommonNeighbor: React.FunctionComponent<IProps> = props => {
  const { contextmenu, hop, selectedStatus = 'selected', activeStatus = 'active' } = props;
  const { graph } = useContext();

  const selectedNodes = graph.findAllByState('node', selectedStatus) as INode[];

  const handleClick = useCallback(() => {
    contextmenu?.onClose();

    graph.getNodes().forEach(node => {
      graph.setItemState(node.getID(), activeStatus, false);
    });
    graph.getEdges().forEach(edge => {
      graph.setItemState(edge.getID(), activeStatus, false);
    });

    const { nodes, edges } = findCommonNeighbors(selectedNodes, hop);
    if (nodes.size < 1) {
      message.warn('没有发现共同邻居！');
    }
    edges.forEach(edge => {
      graph.setItemState(edge.getID(), activeStatus, true);
    });
    nodes.forEach(node => {
      graph.setItemState(node.getID(), activeStatus, true);
    });
  }, [contextmenu, graph, selectedNodes]);

  return (
    <Menu.Item
      disabled={selectedNodes.length < 2}
      key="common-neighbor"
      eventKey="common-neighbor"
      onClick={handleClick}
    >
      {hop > 1 ? `共同邻居(${hop}跳)` : '共同邻居'}
    </Menu.Item>
  );
};

export default CommonNeighbor;
