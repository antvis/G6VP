import { useContext, utils } from '@antv/gi-sdk';
import { Button, Form, Input, notification } from 'antd';
import React from 'react';
import $i18n from '../../i18n';

export interface Props {
  serviceId: string;
}

const Save: React.FunctionComponent<Props> = props => {
  const { serviceId } = props;
  const { graph, GISDK_ID, config, services, schemaData } = useContext();
  const [form] = Form.useForm();
  const service = utils.getService(services, serviceId);
  if (!service) {
    return null;
  }
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
      schemaData,
      cover: imgURL,
      gmtCreate: new Date(),
    }).then(res => {
      if (res.success) {
        notification.success({
          message: $i18n.get({ id: 'basic.components.Save.Component.SavedSuccessfully', dm: '保存成功' }),
          description: $i18n.get({
            id: 'basic.components.Save.Component.AfterSecondsItWillAutomatically',
            dm: '3秒后将自动跳转到分享的画布页',
          }),
          duration: 3,
        });
        setTimeout(() => {
          let url = res.data;
          //兼容之前的旧逻辑：
          if (res.shareId) {
            url = window.location.origin + '/#/share/' + res.shareId;
          }
          window.open(url);
        }, 3000);
      }
    });
  };

  return (
    <div>
      <Form form={form} name="saveStyle" layout="vertical">
        <Form.Item
          name="name"
          label={$i18n.get({ id: 'basic.components.Save.Component.Name', dm: '名称' })}
          rules={[{ required: true, max: 50 }]}
          extra={$i18n.get({
            id: 'basic.components.Save.Component.TheNameConsistsOfChinese',
            dm: '名称由中文、英文或数字组成',
          })}
        >
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          name="description"
          label={$i18n.get({ id: 'basic.components.Save.Component.Description', dm: '描述' })}
          extra={$i18n.get({
            id: 'basic.components.Save.Component.DescriptionConsistsOfChineseEnglish',
            dm: '描述由中文、英文或数字组成',
          })}
          rules={[{ max: 160 }]}
        >
          {/** @ts-ignore  */}
          <Input.TextArea row={4} maxLength={200} />
        </Form.Item>
        <Form.Item name="cover" label={$i18n.get({ id: 'basic.components.Save.Component.Thumbnail', dm: '缩略图' })}>
          <img src={imgURL} alt="" width={'100%'} />
        </Form.Item>
        <Button
          onClick={handleSave}
          type="primary"
          //style={{ position: 'absolute', bottom: '12px', width: 'calc(100% - 44px)' }}
          style={{ width: '100%' }}
        >
          {$i18n.get({ id: 'basic.components.Save.Component.SaveShare', dm: '保存分享' })}
        </Button>
      </Form>
    </div>
  );
};

export default Save;
