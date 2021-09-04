import { GraphinContext } from '@antv/graphin';
import React from 'react';
import './index.less';
export interface NodeAttrsProps {
  serviceId: '';
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const NodeAttrs: React.FunctionComponent<NodeAttrsProps> = props => {
  const { graph } = React.useContext(GraphinContext);
  const [state, setState] = React.useState({
    visible: false,
    modal: {},
  });

  React.useLayoutEffect(() => {
    const handleClick = e => {
      console.log('e', e);
      const modal = e.item.getModel();
      setState({
        visible: true,
        modal,
      });
    };
    graph.on('node:click', handleClick);
    return () => {
      graph.off('node:click', handleClick);
    };
  }, [graph]);
  const { visible, modal } = state;
  const { data } = modal as any;
  console.log('data', data, modal);

  if (visible) {
    return (
      <div className="gi-node-attrs-container">
        <h1>属性面板 </h1>
        <ul>
          {Object.keys(data).map(key => {
            return (
              <li key={key}>
                <div>{key}</div>
                <div>{data[key]}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return null;
};

export default NodeAttrs;
