import { GraphinContext } from '@antv/graphin';
import { Collapse } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import Code from './Code';
import './style.less';

const { Panel } = Collapse;
const defaultUserList = [
  {
    id: 'xiaosuo',
    avatar_url: 'https://avatars.githubusercontent.com/u/105033?v=4',
  },
  {
    id: 'pmuens',
    avatar_url: 'https://avatars.githubusercontent.com/u/1606004?v=4',
  },
  {
    id: 'veris-pr',
    avatar_url: 'https://avatars.githubusercontent.com/u/40563855?v=4',
  },
  {
    id: 'yecol',
    avatar_url: 'https://avatars.githubusercontent.com/u/426463?v=4',
  },
  {
    id: 'savage69kr',
    avatar_url: 'https://avatars.githubusercontent.com/u/54208?v=4',
  },
  {
    id: 'piggybox',
    avatar_url: 'https://avatars.githubusercontent.com/u/54140?v=4',
  },
];
const trans = data => {
  return {
    nodes: data.nodes.map(node => {
      return { data: node, id: node.id };
    }),
    edges: data.edges.map(edge => {
      return { data: edge, source: edge.source, target: edge.target };
    }),
  };
};
const defaultService = {
  service: () => {
    return new Promise(resolve => {
      resolve({});
    });
  },
  id: '',
};
export default props => {
  const { services, dispatch, GiState } = GraphinContext as any;
  const { serviceId } = props;

  const graphin = React.useContext(GraphinContext);
  const { graph } = graphin as any;
  const { data } = GiState;

  const { service } =
    services.find(sr => sr.id === serviceId) ||
    ({} as {
      id: string;
      service: (params: any) => Promise<any>;
    });

  const onChange = async key => {
    console.log('key', key);
    const params = {
      type: key,
    };
    if (service) {
      const res = await service(params);
      dispatch.changeData(trans(res));
    }
  };

  return (
    <div className="graphinSight_sider_box">
      <Collapse onChange={onChange} expandIconPosition="right" defaultActiveKey={['find-hops']} accordion>
        <Panel header={'View the number of steps to Tensorflow'} key="find-hops">
          <Code />
          <p>123</p>
        </Panel>

        <Panel header="View the users who are also following" key="find-common-nbrs">
          <Code />
          {/* <UserList userList={defaultUserList} /> */}
        </Panel>
        <Panel header="View the number of commonly starred projects with the specified user" key="find-common-stars">
          <Code />
          {/* <UserList userList={defaultUserList} /> */}
        </Panel>
        <Panel header="View other users of the same company that also starred GraphScope" key="find-same-company">
          <Code />
          {/* <UserList userList={defaultUserList} /> */}
        </Panel>
        <Panel header="View other users of the same location that also starred GraphScope" key="find-same-location">
          <Code />
          {/* <UserList userList={defaultUserList} /> */}
        </Panel>
        <Panel header="View the number of commonly starred projects with the specified user" key="find-earlier-users">
          <Code />
          {/* <UserList userList={defaultUserList} /> */}
        </Panel>
      </Collapse>
    </div>
  );
};
