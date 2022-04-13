import { useContext, utils } from '@alipay/graphinsight';
import { Menu } from 'antd';
import React from 'react';
const { getService, handleExpand, handleCollaspe } = utils;
const { SubMenu } = Menu;
export interface NodeToggleProps {
  serviceId: '';
  contextmenu: any;
}

const NodeExpandStatus = {};
const NodeExpand: React.FunctionComponent<NodeToggleProps> = props => {
  const { serviceId, contextmenu } = props;
  const { services, graph, data, updateContext, transform } = useContext();
  const service = getService(services, serviceId);
  if (!service) {
    return null;
  }

  const handleClick = e => {
    const { item, onClose } = contextmenu;
    const nodeId = item.getModel().id;
    NodeExpandStatus[nodeId] = !NodeExpandStatus[nodeId];
    const { service } = services.find(sr => sr.id === serviceId) || {};
    if (!service) {
      return;
    }
    service({
      id: nodeId,
      type: [e.key],
    }).then(res => {
      const { nodes, edges } = res;
      if (!res) {
        return {
          nodes,
          edges,
        };
      }
      if (NodeExpandStatus[nodeId]) {
        updateContext(draft => {
          const newData = transform(handleExpand(data, res));
          draft.data = newData;
        });
      } else {
        updateContext(draft => {
          const newData = transform(handleCollaspe(data, res));
          draft.data = newData;
        });
      }
      onClose();
    });
  };

  return (
    <SubMenu key="expand" title="关系扩散">
      <Menu.Item key="family" onClick={handleClick}>
        亲属关系
      </Menu.Item>
      <Menu.Item key="social" disabled>
        社交关系
      </Menu.Item>
      <Menu.Item key="financial" disabled>
        资金关系
      </Menu.Item>
      <Menu.Item key="media" disabled>
        媒介关系
      </Menu.Item>
    </SubMenu>
  );
};

export default NodeExpand;
