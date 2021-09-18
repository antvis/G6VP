import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import { defaultProps } from './registerMeta';
interface CountInfoProps {
  placement: 'LB' | 'RB';
}

const CountInfo: React.FunctionComponent<CountInfoProps> = props => {
  /** Graphin */
  const { graph } = React.useContext(GraphinContext);
  const { nodes, edges } = graph.save() as {
    nodes: any[];
    edges: any[];
  };
  // const nodes = [{ id: 'node-1' }];
  // const edges = [];

  console.log('CountInfo 渲染...', nodes.length, edges.length);

  /** GI */

  /** Props */
  const { placement } = { ...defaultProps, ...props };
  const styles: { [key: string]: React.CSSProperties } = {
    LB: {
      position: 'absolute',
      left: '24px',
      bottom: '24px',
    },
    RB: {
      position: 'absolute',
      right: '24px',
      bottom: '24px',
    },
  };

  return (
    <div style={styles[placement]}>
      放置的位置：{placement}
      Nodes: {nodes.length}
      Edges: {edges.length}
    </div>
  );
};

export default CountInfo;
