import { Button, Popconfirm, Table } from 'antd';
import * as React from 'react';

const PackageTable = ({ data }) => {
  const handleDelete = record => {
    const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
    delete packages[record.global];
    localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(packages));

    location.reload();
  };

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
      render: record => {
        const disabled = record.name === '@antv/gi-assets-basic';
        if (disabled) {
          return null;
        }
        return (
          <Popconfirm
            placement="topRight"
            title={'删除后，资产将不会出现在探索分析页面'}
            onConfirm={() => {
              handleDelete(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" disabled={disabled}>
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns}></Table>;
};

export default PackageTable;
