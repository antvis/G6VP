import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tabs } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';
const { TabPane } = Tabs;
const { TextArea } = Input;
const UploadAssets = () => {
  const [form] = Form.useForm();

  const handleUpload = () => {
    setVisible(true);
  };
  const onCreate = values => {
    const { id } = values;
    const services = JSON.parse(localStorage.getItem('GI_SERVER_DESC') || '{}');
    services[id] = values;
    localStorage.setItem('GI_SERVER_DESC', JSON.stringify(services));
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
        {$i18n.get({ id: 'gi-site.pages.ServerCenter.Upload.AddEngine', dm: '新增引擎' })}
      </Button>

      <Modal
        title={$i18n.get({ id: 'gi-site.pages.ServerCenter.Upload.UploadConfiguration', dm: '上传配置' })}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            label={$i18n.get({ id: 'gi-site.pages.ServerCenter.Upload.EngineName', dm: '引擎名称' })}
            name="title"
            rules={[{ required: true, message: 'Please input your package name!' }]}
          >
            <Input
              placeholder={$i18n.get({
                id: 'gi-site.pages.ServerCenter.Upload.OfficialServicesOfGVp',
                dm: 'G6VP 官方服务',
              })}
            />
          </Form.Item>
          <Form.Item
            label={$i18n.get({ id: 'gi-site.pages.ServerCenter.Upload.EngineId', dm: '引擎ID' })}
            name="id"
            rules={[{ required: true, message: 'Please input your package version!' }]}
          >
            <Input placeholder="GI" />
          </Form.Item>
          <Form.Item
            label={$i18n.get({ id: 'gi-site.pages.ServerCenter.Upload.EngineIntroduction', dm: '引擎介绍' })}
            name="desc"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <TextArea
              placeholder={$i18n.get({
                id: 'gi-site.pages.ServerCenter.Upload.TheDataServiceProvidedBy',
                dm: 'G6VP 提供的数据服务，数据存储在浏览器IndexDB，目前已经支持',
              })}
            />
          </Form.Item>
          <Form.Item
            label={$i18n.get({ id: 'gi-site.pages.ServerCenter.Upload.EngineCover', dm: '引擎封面' })}
            name="cover"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <TextArea placeholder="https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*d--URL3WHPcAAAAAAAAAAAAAARQnAQ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UploadAssets;
