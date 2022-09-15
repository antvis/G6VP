import { EditableProTable } from '@ant-design/pro-table';
import { Button, Form, Modal, Space, message } from 'antd';
import React, { useState } from 'react';
import { updateProjectById } from '../../services';
import './index.less';
interface IProps {
  visible: boolean;
  handleClose: () => void;
  values: any;
}

const MembersPanel: React.FC<IProps> = ({ visible, handleClose, values }) => {
  console.log(values);
  if (!values) {
    return null;
  }

  const { members, id: projectId } = values;
  const [form] = Form.useForm();
  const defaultData = JSON.parse(members);
  const [dataSource, setDataSource] = useState(() => defaultData);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => defaultData.map(item => item.id));
  const columns = [
    {
      title: '工号',
      dataIndex: 'userId',
      width: '40%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '权限',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        ADMIN: { text: '管理员' },
        DEVELOPER: {
          text: '项目成员',
        },
        REPORTER: {
          text: '游客',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: () => null,
    },
  ];

  const handleUpdateMemebers = async () => {
    const result = await updateProjectById(projectId, {
      members: dataSource,
    });

    const { success, errorMsg } = result;
    if (success) {
      message.success('更新成功');
      handleClose();
    }
    message.error(`更新失败：${errorMsg}`);
  };

  return (
    <Modal
      title={'成员管理'}
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
            creatorButtonText: '添加成员',
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
            取消
          </Button>
          <Button type="primary" shape="round" onClick={handleUpdateMemebers}>
            确定
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default MembersPanel;
