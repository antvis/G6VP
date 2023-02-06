import { Button, Space, Table } from 'antd';
import * as React from 'react';
import { addProject } from '../../services/index';
import { activeAssetsKeys, baseConfig } from '../Workspace/utils';
const DatasetTable = ({ data }) => {
  const handleAnalysis = async record => {
    console.log(record);
    // const info = encodeURIComponent(
    //   JSON.stringify({
    //     engineId: record.engineId,
    //     engineContext: record.engineContext,
    //     schemaData: record.schemaData,
    //   }),
    // );
    // window.open(
    //   `${window.location.origin}/#/workspace/graphinsight-0f55-4971-9fcf-3be17c9f5503?nav=data&datasetInfo=${info}`,
    // );
    const projectId = await addProject({
      datasetId: record.id,
      name: '未命名画布',
      status: 1, // 1 正常项目， 0 删除项目
      tag: '',
      members: '',
      projectConfig: baseConfig,
      activeAssetsKeys,
      type: 'project',
    });
    window.open(`${window.location.origin}/#/workspace/${projectId}`);
  };
  const columns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '数据集ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '所有者',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '引擎ID',
      dataIndex: 'engineId',
      key: 'engineId',
    },
    {
      title: '数据集规模',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '操作',
      render: record => {
        return (
          <Space>
            <Button type="text" onClick={() => handleAnalysis(record)}>
              分析
            </Button>
            <Button type="text" disabled>
              分享
            </Button>
            <Button type="text">复制</Button>
            <Button type="text">删除</Button>
          </Space>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns}></Table>;
};

export default DatasetTable;
