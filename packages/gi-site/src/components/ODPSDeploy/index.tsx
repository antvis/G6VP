import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import "./index.less"

interface IFormField {
  image: string;
  workers_num: number;
  project: string;
}

const ODPSDeploy = () => {
  const [form] = Form.useForm<IFormField>();

  const onFinish = () => {
    form.validateFields().then(values => {
      console.log('values:', values);
    });
  };

  return (
    <Form form={form} onFinish={onFinish} className="gi-ODPS-Deploy">
      <Form.Item label="镜像" name="image" rules={[{ required: true, message: '请输入镜像' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="机器数" name="workers_num" rules={[{ required: true, message: '请输入机器数' }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="项目" name="project" rules={[{ required: true, message: '请输入镜像' }]}>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
        <Button type="primary" htmlType="submit">
          确认部署
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ODPSDeploy;
