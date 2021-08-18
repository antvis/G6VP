import { GraphinContext } from '@antv/graphin';
import React from 'react';
export interface NodeAttrsProps {
  serviceId: '';
}

const NodeAttrs: React.FunctionComponent<NodeAttrsProps> = props => {
  const { graph } = React.useContext(GraphinContext);
  const [state, setState] = React.useState({
    visible: false,
    data: {},
  });

  React.useLayoutEffect(() => {
    const handleClick = e => {
      console.log('e', e);
      const { data } = e.item.getModel();
      if (data.children && data.children.length > 0) {
        setState({
          visible: false,
          data: {},
        });
      } else {
        setState({
          visible: true,
          data,
        });
      }
    };
    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, [graph]);
  const { visible, data } = state;
  console.log('data', data);
  const { topic, level, name, url, owner } = data as any;

  if (visible) {
    return (
      <div style={{ position: 'absolute', top: '30px', right: '30px', background: '#ddd' }}>
        <h1>属性面板 </h1>
        <div>
          <div> 技术方向: {topic}</div>
          <div> 技术分层: {level}</div>
          <div> 节点名称: {name}</div>
          <div> 产品链接: {url}</div>
          <div> 产品负责人: {owner}</div>
        </div>
      </div>
    );
  }
  return null;
};

export default NodeAttrs;
