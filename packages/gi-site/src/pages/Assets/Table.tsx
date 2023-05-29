import { Button, Form, Modal, Popconfirm, Table } from 'antd';
import React from 'react';
import PackageForm from './Form';
import { useState } from 'react';

const PackageTable = ({ data, onEdit }) => {
  const [form] = Form.useForm();
  const [editOpen, setEditOpen] = useState(false);

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
      width: 160,
      render: record => {
        const disabled = record.name === '@antv/gi-assets-basic';
        if (disabled) {
          return null;
        }
        return (
          <>
            <Button
              type="text"
              disabled={disabled}
              onClick={() => {
                setEditOpen(true);
                form.setFieldsValue(record);
              }}
            >
              编辑
            </Button>
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
          </>
        );
      },
    },
  ];
  return (
    <>
      <Modal
        title={form.getFieldValue('name') ?? '编辑资产包'}
        open={editOpen}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              onEdit(values.global, values);
              setEditOpen(false);
              form.resetFields();
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => {
          setEditOpen(false);
          form.resetFields();
        }}
      >
        <PackageForm form={form}></PackageForm>
      </Modal>
      <Table dataSource={data} columns={columns} />
    </>
  );
};

export default PackageTable;
