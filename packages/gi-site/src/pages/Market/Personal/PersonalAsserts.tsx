// 我的资产
import { CheckCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, message, Popconfirm, Radio, Space, Table, Tag } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import BaseNavbar from '../../../components/Navbar/BaseNavbar';
import { deleteAssetById, queryAssetList } from '../../../services/assets';
import { STATUS_MAPPING_TR, TYPE_MAPPING_TR } from '../Constants';
import './index.less';

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

  const handleDeleteAsset = async id => {
    const result = await deleteAssetById(id);
    if (result && result.success) {
      message.success('删除成功');
      getAssertList();
    } else {
      message.success(`删除资产失败：${result.errorMsg}`);
    }
  };

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
          text: '布局',
          value: 2,
        },
        {
          text: '数据服务',
          value: 3,
        },
        {
          text: '节点',
          value: 4,
        },
        {
          text: '边',
          value: 5,
        },
      ],
      onFilter: (value, record) => record.type === value,
      render: type => <span>{TYPE_MAPPING_TR[type]}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => {
        if (record.type === 3) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              正常
            </Tag>
          );
        }
        const Component = STATUS_MAPPING_TR[text]?.IconComponent;
        return (
          <Tag icon={<Component />} color={STATUS_MAPPING_TR[text]?.color}>
            {STATUS_MAPPING_TR[text]?.text}
          </Tag>
        );
      },
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
    {
      title: '操作',
      render: (text, record) => {
        // 已经被使用的数据服务不需要操作
        if (record.type === 3) {
          if (record.projectId) {
            // 已经被使用的数据服务不能删除

            return null;
          }
          return (
            <Popconfirm title="确定删除该资产" onConfirm={() => handleDeleteAsset(record.id)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          );
        }

        if (record.status !== 2) {
          // 已经使用的组件不能删除
          if (record.projectId) {
            return <Button type="link">构建</Button>;
          }
          return (
            <Space size="small">
              <Button type="link">构建</Button>
              <Popconfirm title="确定删除该资产" onConfirm={() => handleDeleteAsset(record.id)}>
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          );
        }

        if (record.projectId) {
          return null;
        }
        return (
          <Popconfirm title="确定删除该资产" onConfirm={() => handleDeleteAsset(record.id)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

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

export default PersonAsserts;
