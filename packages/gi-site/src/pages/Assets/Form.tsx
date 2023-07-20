import { Form, Input, type FormInstance } from 'antd';
import React from 'react';
import $i18n from '../../i18n';

const { TextArea } = Input;

export default ({ form, mode = 'create' }: { form: FormInstance, mode?: 'edit' | 'create' }) => {
  return (
    <Form form={form} name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
      <Form.Item
        label={$i18n.get({ id: 'gi-site.pages.Assets.Form.TnpmPackageName', dm: 'Tnpm包名' })}
        name="name"
        rules={[{ required: true, message: 'Please input your package name!' }]}
      >
        <Input placeholder="@antv/gi-assets-basic" />
      </Form.Item>
      <Form.Item
        label={$i18n.get({ id: 'gi-site.pages.Assets.Form.VersionNumber', dm: '版本号' })}
        name="version"
        rules={[{ required: true, message: 'Please input your package version!' }]}
      >
        <Input placeholder="0.12.0" />
      </Form.Item>
      <Form.Item
        label={$i18n.get({ id: 'gi-site.pages.Assets.Form.UmdName', dm: 'UMD名' })}
        name="global"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        {/* UMD名 作为资产的唯一性标识，不允许修改 */}
        <Input placeholder="GI_ASSETS_BASIC"  disabled={mode === 'edit'}/>
      </Form.Item>
      <Form.Item
        label={$i18n.get({ id: 'gi-site.pages.Assets.Form.CdnAddress', dm: 'CDN地址' })}
        name="url"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <TextArea placeholder="https://gw.alipayobjects.com/os/lib/alipay/gi-assets-basic/0.12.0/dist/index.min.js" />
      </Form.Item>
    </Form>
  );
};
