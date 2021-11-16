import { GraphinContext } from '@antv/graphin';
import { Menu } from 'antd';
import React from 'react';

const { SubMenu } = Menu;
export interface NodeToggleProps {
  serviceId: '';
}

/** 数组去重 */
export const uniqueElementsBy = (arr: any[], fn: (arg0: any, arg1: any) => any) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);

const handleExpand = (data, responseData) => {
  const { nodes, edges } = responseData;
  return {
    nodes: uniqueElementsBy([...data.nodes, ...nodes], (a, b) => {
      return a.id === b.id;
    }),
    edges: uniqueElementsBy([...data.edges, ...edges], (a, b) => {
      return a.source === b.source && a.target === b.target;
    }),
  };
};
const handleCollaspe = (data, responseData) => {
  const nodeIds = responseData.nodes.map(c => c.id);
  const edgeIds = responseData.edges.map(c => `${c.source}-${c.target}`);
  const nodes = data.nodes.filter(c => {
    return nodeIds.indexOf(c.id) === -1;
  });
  const edges = data.edges.filter(c => {
    const id = `${c.source}-${c.target}`;
    return edgeIds.indexOf(id) === -1;
  });
  console.log(nodes, edges);

  return {
    nodes,
    edges,
  };
};

const NodeExpandStatus = {};
const NodeExpand: React.FunctionComponent<NodeToggleProps> = props => {
  const { services, dispatch, GiState } = GraphinContext as any;

  const { serviceId } = props;
  const graphin = React.useContext(GraphinContext);
  const { graph, contextmenu } = graphin as any;
  const { data } = GiState;

  const context = contextmenu.node;

  const handleClick = e => {
    const { item } = context;
    const nodeId = item.getModel().id;
    NodeExpandStatus[nodeId] = !NodeExpandStatus[nodeId];
    const { service } = services.find(sr => sr.id === serviceId);
    if (!service) {
      return;
    }
    service({
      id: nodeId,
      type: e.key,
    }).then(res => {
      const { nodes, edges } = res;
      if (!res) {
        return {
          nodes,
          edges,
        };
      }
      if (NodeExpandStatus[nodeId]) {
        dispatch.changeData(handleExpand(data, res));
      } else {
        dispatch.changeData(handleCollaspe(data, res));
      }
    });
  };

  return (
    <div>
      <Menu onClick={handleClick} style={{ width: 110 }} mode="vertical">
        <SubMenu key="expand" title="关系扩散">
          <Menu.Item key="family">亲属关系</Menu.Item>
          <Menu.Item key="social">社交关系</Menu.Item>
          <Menu.Item key="financial">资金关系</Menu.Item>
          <Menu.Item key="media">媒介关系</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
};

export default NodeExpand;
