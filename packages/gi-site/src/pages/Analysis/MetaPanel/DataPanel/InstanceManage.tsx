import { Alert, Space, Drawer, Table, message, Tag, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { findAllEngineInstances } from '../../../../services/engineInstace';
import { closeGraphInstance } from '../../../../services/graphcompute';

interface InstanceManageProps {
  projectId: string;
  visible: boolean;
  close: () => void;
}

const STATUS_MAPPING = {
  NORMAL: {
    text: '正常',
    color: 'green',
  },
  ERROR: {
    text: '异常',
    color: 'red',
  },
};

const InstanceManage: React.FunctionComponent<InstanceManageProps> = props => {
  const { projectId, visible, close } = props;

  const [state, setState] = useState({
    instanceList: [],
  });

  const queryInstanceList = async () => {
    const result = await findAllEngineInstances(projectId);
    console.log('instance list', result);
    if (result.success) {
      setState({
        instanceList: result.data,
      });
    }
  };

  const handleDelete = async record => {
    console.log(record);
    const { instanceId, mode } = record;
    const result = await closeGraphInstance(projectId, mode === 1 ? 'LOCAL' : 'ODPS');
    if (result && result.success) {
      // 提示
      message.success('删除 GraphScope 实例成功');
      queryInstanceList();
    }
  };

  const columns = [
    {
      title: '实例名称',
      dataIndex: 'instanceId',
      key: 'instanceId',
      width: 200,
      fixed: 'left',
    },
    {
      title: '图名称',
      dataIndex: 'activeGraphName',
      key: 'activeGraphName',
      width: 300,
    },
    {
      title: 'GremlinServer',
      dataIndex: 'gremlinServerUrl',
      key: 'gremlinServerUrl',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: text => {
        return <Tag color={STATUS_MAPPING[text].color}>{STATUS_MAPPING[text].text}</Tag>;
      },
    },
    {
      title: 'Owner',
      dataIndex: 'ownerId',
      key: 'ownerId',
      width: 150,
    },
    {
      title: '可用图',
      dataIndex: 'graphNames',
      key: 'graphNames',
      render: (current, record) => {
        return <span>{Object.keys(JSON.parse(current)).join(',')}</span>;
      },
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render: current => {
        return <span>{moment(current).format('YYYY-MM-DD hh:mm:ss')}</span>;
      },
      width: 200,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space>
            <Popconfirm title="确认删除该实例？" okText="确定" cancelText="取消" onConfirm={() => handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    queryInstanceList();
  }, []);

  return (
    <Drawer title="GraphScope实例管理" width="1000" visible={visible} onClose={close}>
      <Alert message="对于状态为异常的实例，建议将其删除，以免在操作过程中出现异常" />
      <Table
        dataSource={state.instanceList}
        columns={columns}
        scroll={{ x: 1500, y: 300 }}
        pagination={{ hideOnSinglePage: true }}
      />
    </Drawer>
  );
};

export default InstanceManage;
