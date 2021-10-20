import { Button, Modal, Form, Input, message, Radio, Select } from 'antd';
import React, { useState } from 'react';
import { createAssets, createNewProjectOnAntCode } from '../../services/assets';
import { EditableProTable } from '@ant-design/pro-table';
import { TYPE_MAPPING } from './Constants';
interface IProps {
  type: string;
  visible: boolean;
  close: () => void;
  history: any;
  projectId?: string;
}

const { Option } = Select;
const CreateAssets: React.FC<IProps> = ({ visible, close, history, type, projectId }) => {
  const [form] = Form.useForm();
  const defaultData = [
    {
      name: 'test',
      id: 1,
      state: 'master',
    },
  ];
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      width: '40%',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '权限',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        master: { text: 'master' },
        developer: {
          text: '可编辑',
        },
        reporter: {
          text: '仅可见',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: () => null,
    },
  ];
  const [dataSource, setDataSource] = useState(() => defaultData);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => defaultData.map(item => item.id));
  const handleCreate = async () => {
    const assetParams = form.getFieldsValue();
    const { name, description, displayName } = assetParams;

    // 数据服务不需要在 antcode 上创建仓库
    // step1: 在 antcode 上创建仓库
    const createResult = await createNewProjectOnAntCode({
      projectName: name,
      description,
      type: TYPE_MAPPING[type],
      members: dataSource,
    });

    if (!createResult || !createResult.success) {
      message.error('创建资产失败：' + createResult.errorMsg);
      return;
    }

    // step2: 将资产插入到数据库中
    const dbResponse = await createAssets({
      displayName,
      name,
      type: TYPE_MAPPING[type],
      description,
      version: '0.0.1',
      // 这两个字段需要从登陆信息中获取，目前没有接入登陆
      ownerNickname: '聚则',
      ownerId: '195094',
      branchName: 'master',
      projectId,
      sourceCode: 'export default (data) => {\n return data \n}',
    });

    if (!dbResponse || !dbResponse.success) {
      message.error('创建项目失败：' + dbResponse.errorMsg);
      return;
    }

    const { data } = dbResponse;

    // step3: 跳转到资产编辑页面
    history.push(
      `/market/${data.insertId}?assetId=${data.insertId}&project=${name}&branch=master&type=${TYPE_MAPPING[type]}`,
    );
  };
  return (
    <Modal
      title={type === 'component' ? '新建资产' : type === 'element' ? '新建图元素' : '新建数据服务'}
      visible={visible}
      width={846}
      footer={null}
      onCancel={close}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="vertical" onFinish={handleCreate}>
        <Form.Item label="资产名称" name="name" rules={[{ required: true, message: '请填写用户名' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="资产类型" name="type" className="round">
          <Radio.Group defaultValue="Empty" size="small">
            <Radio.Button value="layout" style={{ marginRight: 10, borderRadius: 17 }}>
              布局
            </Radio.Button>
            <Radio.Button value="element" style={{ marginRight: 10, borderRadius: 17 }}>
              元素
            </Radio.Button>
            <Radio.Button value="component" style={{ marginRight: 10, borderRadius: 17 }}>
              组件
            </Radio.Button>
            <Radio.Button value="other" style={{ marginRight: 10, borderRadius: 17 }}>
              其他
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="权限类型" name="authority">
          <Select>
            <Option value="private">仅自己可见</Option>
            <Option value="public">部分人可见</Option>
          </Select>
        </Form.Item>
        {/* <Form.Item label="成员管理" name="members"> */}
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
            formProps: {},
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
          }}
        />
        {/* </Form.Item> */}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button style={{ marginRight: 8 }} shape="round">
            保存并返回
          </Button>
          <Button type="primary" shape="round" htmlType="submit">
            立即去创建分析
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAssets;
