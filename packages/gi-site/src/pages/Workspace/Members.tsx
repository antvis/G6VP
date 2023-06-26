import { EditableProTable } from '@ant-design/pro-table';
import { Button, Form, message, Modal, Space } from 'antd';
import React, { useState } from 'react';
import { updateProjectById } from '../../services';
import $i18n from '../../i18n';
import './index.less';
interface IProps {
  visible: boolean;
  handleClose: () => void;
  values: any;
}

const MembersPanel: React.FC<IProps> = ({ visible, handleClose, values }) => {
  if (!values) {
    return null;
  }

  const { members, id: projectId } = values;
  const [form] = Form.useForm();
  const defaultData = members;
  const [dataSource, setDataSource] = useState(() => defaultData);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => defaultData.map(item => item.id));
  const columns = [
    {
      title: $i18n.get({ id: 'gi-site.pages.Workspace.Members.EmployeeNumber', dm: '工号' }),
      dataIndex: 'userId',
      width: '40%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [
            {
              required: true,
              message: $i18n.get({ id: 'gi-site.pages.Workspace.Members.ThisItemIsRequired', dm: '此项为必填项' }),
            },
          ],
        };
      },
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Workspace.Members.Permission', dm: '权限' }),
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        ADMIN: { text: $i18n.get({ id: 'gi-site.pages.Workspace.Members.Administrator', dm: '管理员' }) },
        DEVELOPER: {
          text: $i18n.get({ id: 'gi-site.pages.Workspace.Members.ProjectMembers', dm: '项目成员' }),
        },
        REPORTER: {
          text: $i18n.get({ id: 'gi-site.pages.Workspace.Members.Tourists', dm: '游客' }),
        },
      },
    },
    {
      title: $i18n.get({ id: 'gi-site.pages.Workspace.Members.Operation', dm: '操作' }),
      valueType: 'option',
      width: 200,
      render: () => null,
    },
  ];

  const handleUpdateMemebers = async () => {
    const result = await updateProjectById(projectId, {
      members: dataSource,
    });
    if (result) {
      message.success($i18n.get({ id: 'gi-site.pages.Workspace.Members.UpdatedSuccessfully', dm: '更新成功' }));
      handleClose();
    }
  };

  return (
    <Modal
      title={$i18n.get({ id: 'gi-site.pages.Workspace.Members.MemberManagement', dm: '成员管理' })}
      visible={visible}
      width={846}
      footer={null}
      onCancel={handleClose}
      bodyStyle={{
        paddingTop: '10px',
      }}
    >
      <Form form={form} labelCol={{ span: 4 }} layout="vertical">
        <EditableProTable
          columns={columns}
          value={dataSource}
          rowKey="id"
          recordCreatorProps={{
            creatorButtonText: $i18n.get({ id: 'gi-site.pages.Workspace.Members.AddMembers', dm: '添加成员' }),
            newRecordType: 'dataSource',
            record: () => ({
              id: dataSource.length + 1,
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
          }}
        />

        <Space>
          <Button shape="round" onClick={handleClose}>
            {$i18n.get({ id: 'gi-site.pages.Workspace.Members.Cancel', dm: '取消' })}
          </Button>
          <Button type="primary" shape="round" onClick={handleUpdateMemebers}>
            {$i18n.get({ id: 'gi-site.pages.Workspace.Members.Ok', dm: '确定' })}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default MembersPanel;
