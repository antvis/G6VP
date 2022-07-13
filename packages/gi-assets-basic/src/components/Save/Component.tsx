import { useContext, utils } from '@alipay/graphinsight';
import { Button, Form, Input, notification } from 'antd';
import React from 'react';

export interface Props {
  serviceId: string;
}

const Save: React.FunctionComponent<Props> = props => {
  const { serviceId } = props;
  const { graph, GISDK_ID, config, services, schema } = useContext();
  const [form] = Form.useForm();
  const service = utils.getService(services, serviceId);
  const imgURL = graph.toDataURL('image/jpeg', '#fff');
  const handleSave = () => {
    const { name, description } = form.getFieldsValue();

    const data = graph.save();

    service({
      name,
      description,
      data, //数据，带布局信息
      config, //配置，可以还原画布状态
      services, //服务
      schemaData: schema,
      cover: imgURL,
      gmtCreate: new Date(),
    }).then(res => {
      if (res.success) {
        notification.success({
          message: '保存成功',
          description: '3秒后将自动跳转到分享的画布页',
          duration: 3,
        });
        setTimeout(() => {
          const herfURL = window.location.origin + '/#/share/' + res.data.shareId;
          window.open(herfURL);
        }, 3000);
      }
    });
  };

  return (
    <div>
      <Form form={form} name="saveStyle" layout="vertical">
        <Form.Item name="name" label="名称" rules={[{ required: true, max: 50 }]} extra="名称由中文、英文或数字组成">
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item name="description" label="描述" extra="描述由中文、英文或数字组成" rules={[{ max: 160 }]}>
          {/** @ts-ignore  */}
          <Input.TextArea row={4} maxLength={200} />
        </Form.Item>
        <Form.Item name="cover" label="缩略图">
          <img src={imgURL} alt="" width={'100%'} />
        </Form.Item>
        <Button
          onClick={handleSave}
          type="primary"
          //style={{ position: 'absolute', bottom: '12px', width: 'calc(100% - 44px)' }}
          style={{ width: '100%' }}
        >
          保存分享
        </Button>
      </Form>
    </div>
  );
};

export default Save;
