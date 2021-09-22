import { CheckCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Collapse, Select } from 'antd';
import React from 'react';
import Code from './Code';
import { userList } from './config';
import { getCodeConfig } from './getCodeConfig';
import RenderList from './RenderList';
import './style.less';

const { Panel } = Collapse;
const { Option } = Select;

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

const getParams = (type, user) => {
  const params = {
    type,
    src: user,
  };
  if (type === 'find-common-nbrs') {
    return { ...params };
  }
  if (type === 'find-hops') {
    return {
      ...params,
      dst: 'tensorflow',
    };
  }
  if (type === 'find-common-stars') {
    return {
      ...params,
      friend: 'veris-pr',
    };
  }
  if (type === 'find-same-company') {
    return {
      ...params,
      project: 'graphscope',
    };
  }
  if (type === 'find-same-location') {
    return {
      ...params,
      project: 'graphscope',
    };
  }
  if (type === 'find-earlier-users') {
    return {
      ...params,
      project: 'graphscope',
    };
  }
  return params;
};

const getRenderList = (obj, type) => {
  // type === 'Repository'时为项目节点，没有type 属性时为用户节点
  const { nodes = [], ids } = obj;
  return type === 'Repository' ? ids : nodes.filter(item => item.type !== 'Repository');
};

export default props => {
  /** GI*/
  const { services, dispatch } = GraphinContext as any;
  const graphin = React.useContext(GraphinContext);
  const { graph } = graphin as any;

  /** STATE */
  const [state, setState] = React.useState<{
    isLoading: boolean;
    activeKey: string;
    res: {
      nodes: any[];
      edges: any[];
      [key: string]: any;
    };
  }>({
    isLoading: false,
    activeKey: '',
    res: {
      nodes: [],
      edges: [],
    },
  });

  const { serviceId, currentUser = 'xiaosuo' } = props;
  const codeConfig = getCodeConfig(currentUser);

  const { service } =
    services.find(sr => sr.id === serviceId) ||
    ({} as {
      id: string;
      service: (params: any) => Promise<any>;
    });

  const onChange = async key => {
    const params = getParams(key, currentUser);

    console.log('key', key, params);

    if (service) {
      const result = await service(params);
      setState(preState => {
        return {
          ...preState,
          res: result,
        };
      });
      /** 回调给GI */
      dispatch.changeData(trans(result));
    }
  };

  const handleSelectChange = val => {};

  const { isLoading, res, activeKey } = state;

  return (
    <div className="graphinSight_sider_box">
      <Collapse onChange={onChange} expandIconPosition="right" defaultActiveKey={['find-hops']} accordion>
        <Panel header={'View the number of steps to Tensorflow'} key="find-hops">
          <Code codeList={codeConfig.findHops} />
          {isLoading ? (
            <SmileOutlined style={{ fontSize: 14 }} spin />
          ) : (
            <p>
              <CheckCircleOutlined style={{ color: '#00AB34', marginRight: 8, fontSize: 14 }} />
              <span>{res.hops}</span>
            </p>
          )}
          <p>123</p>
        </Panel>
        <Panel header="View the users who are also following" key="find-common-nbrs">
          <Code codeList={codeConfig.findCommonNbrs} />
          <RenderList loading={isLoading} userList={getRenderList(res, activeKey)} />
        </Panel>
        <Panel header="View the number of commonly starred projects with the specified user" key="find-common-stars">
          <div className="user_search" id="user_search">
            <Select
              style={{ width: '100%' }}
              showSearch
              filterOption={(val, option: any) =>
                option.props.children.toLocaleUpperCase().includes(val.toLocaleUpperCase())
              }
              placeholder="查找用户"
              onChange={val => handleSelectChange(val)}
              //@ts-ignore
              getPopupContainer={() => document.getElementById('user_search')}
            >
              {userList.map(item => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </div>

          <Code codeList={codeConfig.findCommonStars} />
          <RenderList isRepository userList={getRenderList(res, 'Repository')} loading={isLoading} />
        </Panel>
        <Panel header="View other users of the same company that also starred GraphScope" key="find-same-company">
          <Code codeList={codeConfig.findSameCompany} />
          <RenderList userList={getRenderList(res, activeKey)} loading={isLoading} />
        </Panel>
        <Panel header="View other users of the same location that also starred GraphScope" key="find-same-location">
          <Code codeList={codeConfig.findSameLocation} />
          <RenderList userList={getRenderList(res, activeKey)} loading={isLoading} />
        </Panel>
        <Panel header="find earlier users" key="find-earlier-users">
          <Code codeList={codeConfig.findEarlierUsers} />
          <RenderList userList={getRenderList(res, activeKey)} loading={isLoading} />
        </Panel>
      </Collapse>
    </div>
  );
};
