import { extractDefault } from '@ali/react-datav-gui-utils';
import { GraphinContext } from '@antv/graphin';
import { Input } from 'antd';
import React from 'react';
import './index.less';
import NodeProfile from './NodeProfile';
import NodeProperties from './NodeProperties';
import registerMeta from './registerMeta';
const { Search } = Input;
export interface NodeAttrsProps {
  serviceId: '';
  multiple: boolean;
}

export const defaultProps = extractDefault({ config: registerMeta({ data: {} }) }) as NodeAttrsProps;

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const NodeAttrs: React.FunctionComponent<NodeAttrsProps> = props => {
  const { multiple } = { ...defaultProps, ...props };
  const { graph } = React.useContext(GraphinContext);
  const [state, setState] = React.useState({
    visible: false,
    nodes: [],
  });

  React.useLayoutEffect(() => {
    const handleSelect = e => {
      const nodes = e.selectedItems.nodes.map(item => {
        return item?.getModel();
      });
      const isEmpty = nodes.length === 0;
      setState({
        visible: isEmpty ? false : true,
        nodes,
      });
    };
    const handleClose = e => {
      setState({
        visible: false,
        nodes: [],
      });
    };
    //@ts-ignore
    graph.on('nodeselectchange', handleSelect);
    // graph.on('canvas:click', handleClose);
    return () => {
      graph.off('nodeselectchange', handleSelect);
      // graph.off('canvas:click', handleClose);
    };
  }, [graph, setState]);
  const { visible, nodes } = state;

  const isMultiple = nodes.length >= 2;

  if (visible) {
    if (isMultiple) {
      return (
        <div className="gi-node-attrs-container">
          <NodeProfile nodes={nodes}></NodeProfile>
        </div>
      );
    }
    return (
      <div className="gi-node-attrs-container">
        <NodeProperties node={nodes[0]}></NodeProperties>
      </div>
    );
  }
  return null;
};

export default NodeAttrs;
