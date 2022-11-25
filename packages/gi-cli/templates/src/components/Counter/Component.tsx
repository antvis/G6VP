import { useContext } from '@antv/gi-sdk';
import React from 'react';
const Counter = props => {
  const { graph, data } = useContext();

  const nodes = data.nodes.length;
  const edges = data.edges.length;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100px',
        left: '50px',
        background: 'red',
      }}
    >
      Nodes Count: {nodes} <br />
      Edges Count: {edges}
    </div>
  );
};

export default Counter;
