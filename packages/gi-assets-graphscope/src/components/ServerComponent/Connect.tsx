import { CollapseCard, GISiteParams, utils } from '@antv/gi-sdk';
import { Alert, Button, Form, Input, notification } from 'antd';
import React, { useState } from 'react';
import {connectGraphScopeService} from './services'

import './index.less';

export interface ConnectProps {
  updateGISite?: (params: GISiteParams) => void;
  updateToken: () => void;
  giSiteContext?: any;
  token: string | null;
}

const { protocol, hostname } = location;
const DEFAULT_HTTP_SERVICE_URL = `${protocol}//${hostname}:7001`;
const DEFAULT_VALUE = {
  username: '',
  password: '',
  HTTP_SERVICE_URL: DEFAULT_HTTP_SERVICE_URL,
  engineServerURL: '',
  CURRENT_TUGRAPH_SUBGRAPH: 'MovieDemo1',
};

const Connect: React.FC<ConnectProps> = ({ updateGISite, updateToken, token }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    form.setFieldsValue(utils.getServerEngineContext(DEFAULT_VALUE));
  }, []);

  const handleSubmitForm = async () => {
    setLoading(true);

    const values = await form.validateFields().catch(() => {
      setLoading(false);
    });
    if (!values) {
      return;
    }

    utils.setServerEngineContext(values);
    const result = await connectGraphScopeService();
    setLoading(false);

    if (result) {
      notification.success({
        message: '连接 GraphScope 数据源成功',
        description: '请继续选择子图，进入分析',
      });
      updateToken();
    } else {
      notification.error({
        message: '连接 GraphScope 数据库失败',
        style: {
          width: 500,
        },
        description: (
          <>
            ✅ 请检查 antvis/gi-httpservice 镜像是否启动 <br />✅ 请检查 GraphScope 数据库地址，账户，密码是否填写正确
          </>
        ),
      });
    }
  };
  const submitMessage = token ? '重新连接' : '开始连接';

  return (
    <>
      <CollapseCard title="连接数据库" defaultActive={!Boolean(token)}>
        <Form name="gsform" form={form}>
          {loading && (
            <Alert
              type="info"
              showIcon
              style={{ marginTop: 16, marginBottom: 16 }}
              message="正在连接 GraphScope 数据库，请耐心等待……"
            />
          )}
          <Form.Item
            label="平台地址"
            name="HTTP_SERVICE_URL"
            rules={[{ required: true, message: '平台服务地址必填!' }]}
          >
            <Input placeholder="请输入 gi-httpservice 地址" />
          </Form.Item>
          <Form.Item label="引擎地址" name="engineServerURL" rules={[{ required: true, message: '数据库地址必填!' }]}>
            <Input placeholder="请输入数据库地址，格式为 ip:port" />
          </Form.Item>
          <Form.Item label="账名" name="username" rules={[{ required: true, message: '数据库用户名必填!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '数据库登录密码必填!' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmitForm} loading={loading} style={{ width: '100%' }}>
              {submitMessage}
            </Button>
          </Form.Item>
        </Form>
      </CollapseCard>
    </>
  );
};

export default Connect;
