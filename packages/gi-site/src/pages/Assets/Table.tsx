import { Button, Form, Modal, Popconfirm, Table } from 'antd';
import React from 'react';
import PackageForm from './Form';
import { useState } from 'react';
import $i18n from '../../i18n';

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
      title: $i18n.get({ id: 'gi-site.pages.Assets.Table.PackageName', dm: '包名' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Assets.Table.UmdGlobalVariables', dm: 'UMD 全局变量' }),
      dataIndex: 'global',
      key: 'global',
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Assets.Table.Version', dm: '版本' }),
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Assets.Table.Address', dm: '地址' }),
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Assets.Table.Operation', dm: '操作' }),
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
              {$i18n.get({ id: 'gi-site.pages.Assets.Table.Edit', dm: '编辑' })}
            </Button>
            <Popconfirm
              placement="topRight"
              title={$i18n.get({
                id: 'gi-site.pages.Assets.Table.AfterDeletionAssetsWillNot',
                dm: '删除后，资产将不会出现在探索分析页面',
              })}
              onConfirm={() => {
                handleDelete(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" disabled={disabled}>
                {$i18n.get({ id: 'gi-site.pages.Assets.Table.Delete', dm: '删除' })}
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
        title={
          form.getFieldValue('name') ??
          $i18n.get({ id: 'gi-site.pages.Assets.Table.EditAssetPackage', dm: '编辑资产包' })
        }
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
