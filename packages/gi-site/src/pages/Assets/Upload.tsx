import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Modal } from 'antd';
import * as React from 'react';
import PackageForm from './Form';

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
    location.reload();
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
      <Button onClick={handleUpload} type="primary" icon={<UploadOutlined />}>
        本地上传资产包
      </Button>

      <Modal title="上传配置" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <PackageForm form={form} />
      </Modal>
    </div>
  );
};
export default UploadAssets;
