import { Table } from 'antd';
import * as React from 'react';

const PackageTable = ({ data }) => {
  const columns = [
    {
      title: '包名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'UMD 全局变量',
      dataIndex: 'global',
      key: 'global',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '操作',
      render: () => {
        return <>删除</>;
      },
    },
  ];
  return <Table dataSource={data} columns={columns}></Table>;
};

export default PackageTable;
