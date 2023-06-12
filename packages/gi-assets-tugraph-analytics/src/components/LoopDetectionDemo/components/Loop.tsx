import React from 'react';
import './Loop.less';
import { Node, type INode } from './Nodes';

interface ILoop {
  nodes: INode[];
}

// 计算节点的位置坐标
const calculateNodePosition = (
  totalNodes: number,
  index: number,
  radius: number
) => {
  const angle = (2 * Math.PI * index) / totalNodes;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return { x, y };
};

export const Loop = ({ nodes }: ILoop) => {
  if (nodes.length < 2) return null;

  const finalNodes = nodes.slice(0, -1);

  const radius = Math.min(Math.floor(finalNodes.length / 3) * 25, 160);
  const size = radius * 2 + 20;
  const nodeCount = finalNodes.length;

  // 计算每个节点的位置坐标
  const nodePositions = finalNodes.map((node, index) =>
    calculateNodePosition(nodeCount, index, radius)
  );

  // 渲染每个节点
  const renderNodes = () =>
    finalNodes.map((node, index) => {
      const { x, y } = nodePositions[index];
      return (
        <Node
          key={index}
          id={node.id}
          style={{
            position: 'absolute',
            top: radius + y,
            left: radius + x,
          }}
        />
      );
    });

  return (
    <div className="loop-container" style={{ width: size, height: size }}>
      <div className="loop-circle"></div>
      {renderNodes()}
    </div>
  );
};
