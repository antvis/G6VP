import { Button, Space, Table } from 'antd';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteDataset } from '../../services/dataset';
// import { getUid } from '../Workspace/utils';
const DatasetTable = ({ data }) => {
  const history = useHistory();

  const handleDelete = async record => {
    await deleteDataset(record.id);
  };
  const handleView = record => {
    history.push(`/workbook/template/${record.id}`);
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
      title: '操作',
      render: record => {
        return (
          <Space>
            <Button type="text" onClick={() => handleView(record)}>
              详情
            </Button>

            <Button type="text" onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns}></Table>;
};

export default DatasetTable;
