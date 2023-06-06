import { Tooltip } from 'antd';
import React, { type CSSProperties, memo } from 'react';
import { getColor, mapNodeToColorIndex } from '../utils';

export interface INode {
  id: string;
  name?: string;
  style?: CSSProperties;
}

export const Node = memo(({ id, name, style = {} }: INode) => (
  <Tooltip title={name}>
    <div
      style={{
        alignItems: 'center',
        backgroundColor: getColor(mapNodeToColorIndex(id), 'candies'),
        borderRadius: 20,
        display: 'flex',
        height: 20,
        justifyContent: 'center',
        minWidth: 20,
        ...style,
      }}
    >
      <span style={{ fontSize: 12, fontFamily: 'monospace' }}>{id}</span>
    </div>
  </Tooltip>
));

export const Nodes = memo(({ nodes }: { nodes: INode[] }) => {
  if (!nodes.length) return <></>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {nodes.map((node) => (
        <Node {...node} />
      ))}
    </div>
  );
});
