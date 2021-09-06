import { extractDefault } from '@ali/react-datav-gui-utils';
import { GraphinContext } from '@antv/graphin';
import { Input } from 'antd';
import React from 'react';
import './index.less';
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
    const handleClose = e => {
      setState({
        visible: false,
        modal: {},
      });
    };
    graph.on('node:click', handleClick);
    graph.on('canvas:click', handleClose);
    return () => {
      graph.off('node:click', handleClick);
      graph.off('canvas:click', handleClose);
    };
  }, [graph, setState]);
  const { visible, modal } = state;
  const { data } = modal as any;

  const onSearch = () => {};
  if (visible) {
    return (
      <div className="gi-node-attrs-container">
        <h1>{data.id}</h1>
        <Search placeholder="Search in the properties" onSearch={onSearch} style={{ width: '100%' }} />
        <ul>
          {Object.keys(data).map(key => {
            let content = data[key];
            if (typeof content == 'object') {
              content = JSON.stringify(content, null, 2);
            }
            return (
              <li key={key}>
                <div className="key">{key}</div>
                <div className="value">{content}</div>
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
