// 我的资产
import { Breadcrumb, Table, Radio } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';
import { useImmer } from 'use-immer';
import { queryAssetList } from '../../../services/assets';
import BaseNavbar from '../../../components/Navbar/BaseNavbar';
import store from '../../Analysis/redux';
import { TYPE_MAPPING_TR } from '../Constants';
import './index.less';

const columns = [
  {
    title: '资产名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    fixed: 'left',
  },
  {
    title: '类别',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    fixed: 'left',
    filters: [
      {
        text: '组件',
        value: 1,
      },
      {
        text: '元素',
        value: 2,
      },
      {
        text: '数据服务',
        value: 3,
      },
    ],
    onFilter: (value, record) => record.type === value,
    render: type => <span>{TYPE_MAPPING_TR[type]}</span>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
    defaultSortOrder: 'descend',
    sorter: (a, b) => Date.parse(a.gmtCreate) - Date.parse(b.gmtCreate),
  },
  {
    title: '更新时间',
    dataIndex: 'gmtModified',
    key: 'gmtModified',
    defaultSortOrder: 'descend',
    sorter: (a, b) => Date.parse(a.gmtModified) - Date.parse(b.gmtModified),
  },
  {
    title: '资产权限',
    dataIndex: 'publicLevel',
    key: 'publicLevel',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

const PersonAsserts = () => {
  const [state, setState] = useImmer({
    asserts: [],
  });
  const getAssertList = async () => {
    // TO do 需要替换成获取 我的资产 接口
    const result = await queryAssetList();

    const { data, success } = result;
    if (success) {
      setState(draft => {
        draft.asserts = data;
      });
    }
  };

  React.useEffect(() => {
    getAssertList();
  }, []);
  return (
    <>
      <BaseNavbar active="market"></BaseNavbar>
      <div className="tabpane">
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/#/market">资产市场</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>我的资产</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <h3 style={{ fontSize: 18, marginBottom: 0 }}>我的资产</h3>
        <Radio.Group defaultValue="all" size="small">
          <Radio.Button value="all" style={{ marginRight: 10, borderRadius: 17 }}>
            全部
          </Radio.Button>
          <Radio.Button value="public" style={{ marginRight: 10, borderRadius: 17 }}>
            已发布
          </Radio.Button>
        </Radio.Group>
      </div>
      <div className="asserts-container">
        <Table columns={columns} dataSource={state.asserts} scroll={{ x: 1300 }} />
      </div>
    </>
  );
};

const WrapPersonAssets = props => {
  return (
    <Provider store={store}>
      <PersonAsserts {...props} />
    </Provider>
  );
};
export default WrapPersonAssets;
