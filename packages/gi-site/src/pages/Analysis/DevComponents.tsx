import { GIContext } from '@alipay/graphinsight';
import React from 'react';
import './index.less';

/** 二次开发的组件模式 */
const DevComponents = () => {
  const gi = React.useContext(GIContext);
  const { graph } = gi;
  const { nodes, edges } = graph.save() as { nodes: any[]; edges: any[] };

  return (
    <div style={{ position: 'absolute', top: '80px', left: '20px', background: '#ddd' }}>
      Node: {nodes.length}
      Edge: {nodes.length}
    </div>
  );
};
export default DevComponents;
