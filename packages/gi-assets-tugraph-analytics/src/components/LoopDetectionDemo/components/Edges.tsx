import React, { memo } from 'react';
import { Node } from './Nodes';
import { Tooltip } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';

export interface IEdge {
  source: string;
  target: string;
  weight: number;
}

const Edge = memo(({ edge }: { edge: IEdge }) => {
  const { source, target, weight } = edge;

  return (
    <div style={{ display: 'flex' }}>
      <Node id={source} />
      <Tooltip title={weight}>
        <SwapRightOutlined />
      </Tooltip>
      <Node id={target} />
    </div>
  );
});

export const Edges = memo(({ edges }: { edges: IEdge[] }) => {
  if (!edges.length) return <></>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {edges.map((edge) => (
        <Edge edge={edge} />
      ))}
    </div>
  );
});
