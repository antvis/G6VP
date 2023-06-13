import { Form, Input, type FormInstance } from 'antd';
import React from 'react';

const { TextArea } = Input;

export default ({ form }: { form: FormInstance }) => {
  return (
    <Form form={form} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <Form.Item label="Tnpm包名" name="name" rules={[{ required: true, message: 'Please input your package name!' }]}>
        <Input placeholder="@antv/gi-assets-basic" />
      </Form.Item>
      <Form.Item
        label="版本号"
        name="version"
        rules={[{ required: true, message: 'Please input your package version!' }]}
      >
        <Input placeholder="0.12.0" />
      </Form.Item>
      <Form.Item label="UMD名" name="global" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input placeholder="GI_ASSETS_BASIC" />
      </Form.Item>
      <Form.Item label="CDN地址" name="url" rules={[{ required: true, message: 'Please input your password!' }]}>
        <TextArea placeholder="https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/0.12.0/dist/index.min.js" />
      </Form.Item>
    </Form>
  );
};
