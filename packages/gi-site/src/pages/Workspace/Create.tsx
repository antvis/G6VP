import { Button, Modal, Form, Input, Space, Radio, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import './index.less';

interface IProps {
  visible: boolean;
  handleClose: () => void;
}

const { Option } = Select;
const CreatePanel: React.FC<IProps> = ({ visible, handleClose }) => {
  const [form] = Form.useForm();

  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      width: '40%',
    },
    {
      title: '权限',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
  ];
  const onFinish = values => {
    console.log('form values', values);
  };

  return (
    <Modal title={'创建项目'} visible={visible} width={846} footer={null} onCancel={handleClose}>
      <Form form={form} labelCol={{ span: 4 }} layout="vertical" onFinish={onFinish}>
        <Form.Item label="项目名称" name="displayName">
          <Input />
        </Form.Item>
        <Form.Item label="成员设置" name="name">
          <EditableProTable headerTitle="可编辑表格" columns={columns} />
          {/* <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'first']}
                      fieldKey={[fieldKey, 'first']}
                      rules={[{ required: true, message: '请填写用户名' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'last']}
                      fieldKey={[fieldKey, 'last']}
                      rules={[{ required: true, message: '请选择权限' }]}
                    >
                      <Select placeholder="请选择" allowClear>
                        <Option value="developer">可编辑</Option>
                        <Option value="reporter">仅可见</Option>
                        <Option value="master">master</Option>
                      </Select>
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>
                      删除
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add field
                </Button>
              </>
            )}
          </Form.List> */}
        </Form.Item>
        <Form.Item label="项目类型" name="description" className="round">
          <Radio.Group defaultValue="Empty" size="small">
            <Radio.Button value="GIConfig" style={{ marginRight: 10, borderRadius: 17 }}>
              前端大学图谱模版
            </Radio.Button>
            <Radio.Button value="Empty" style={{ marginRight: 10, borderRadius: 17 }}>
              空白模版
            </Radio.Button>
            <Radio.Button value="knowledgeGraph" style={{ marginRight: 10, borderRadius: 17 }}>
              数据图谱
            </Radio.Button>
            <Radio.Button value="riskControl" style={{ marginRight: 10, borderRadius: 17 }}>
              企业风控
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
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

export default CreatePanel;
