import { Button, Form, Input, Modal, Tabs } from 'antd';
import * as React from 'react';
const { TabPane } = Tabs;
const { TextArea } = Input;
const UploadAssets = () => {
  const [form] = Form.useForm();

  const handleUpload = () => {
    setVisible(true);
  };
  const onCreate = values => {
    const { global } = values;
    const packages = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
    packages[global] = values;
    localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(packages));
  };
  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onCreate(values);
        setVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const [visible, setVisible] = React.useState(false);
  return (
    <div>
      <h1>
        <Button onClick={handleUpload} type="primary">
          本地上传资产包
        </Button>
      </h1>

      <Modal title="上传配置" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item
            label="Tnpm包名"
            name="name"
            rules={[{ required: true, message: 'Please input your package name!' }]}
          >
            <Input placeholder="@alipay/gi-assets-basic" />
          </Form.Item>
          <Form.Item
            label="版本号"
            name="version"
            rules={[{ required: true, message: 'Please input your package version!' }]}
          >
            <Input placeholder="0.12.0" />
          </Form.Item>
          <Form.Item label="UMD名" name="global" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input placeholder="GI_Assets_Basic" />
          </Form.Item>
          <Form.Item label="CDN地址" name="url" rules={[{ required: true, message: 'Please input your password!' }]}>
            <TextArea placeholder="https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/0.12.0/dist/index.min.js" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UploadAssets;
