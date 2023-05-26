import { Alert, Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { utils } from '../../index';
import CollapseCard from '../CollapseCard';
import './index.less';
import { getEngineForm, setEngineForm } from './utils';

export interface ConnectProps {
  isSocketConnect?: boolean;
  engineId: string;
  updateToken: () => void;
  token: string | null;
  connectDatabase: (params?: any) => Promise<boolean> | boolean;
  docs: string;
}

const { protocol, hostname } = location;

const DEFAULT_VALUE = {
  username: '',
  password: '',
  HTTP_SERVICE_URL: 'http://127.0.0.1:7001',
  engineServerURL: '',
  CURRENT_SUBGRAPH: '',
};

const Connect: React.FC<ConnectProps> = ({ updateToken, token, engineId, connectDatabase, isSocketConnect, docs }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    form.setFieldsValue(getEngineForm(engineId, DEFAULT_VALUE));
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
    setEngineForm(engineId, values);
    const result = await connectDatabase();
    setLoading(false);
    if (result) {
      updateToken();
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
              message={`正在连接 ${engineId} 数据库，请耐心等待……`}
            />
          )}
          {!isSocketConnect && (
            <Form.Item
              label="代理地址"
              name="HTTP_SERVICE_URL"
              tooltip="平台提供 packages/gi-httpservices 来代理连接，请依照文档启动：https://www.yuque.com/antv/gi/fyc33eg85bwnlqxa"
              // rules={[{ required: true, message: 'G6VP 平台服务地址必填!' }]}
            >
              <Input placeholder="请输入代理地址，默认 http://127.0.0.1:7001" />
            </Form.Item>
          )}
          <Form.Item
            label="引擎地址"
            name="engineServerURL"
            tooltip={`图数据库地址，请提前准备好数据`}
            // rules={[{ required: true, message: '数据库地址必填!' }]}
          >
            <Input placeholder="请输入图引擎地址" />
          </Form.Item>
          <Form.Item
            label="账名"
            name="username"
            //  rules={[{ required: true, message: '数据库用户名必填!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            // rules={[{ required: true, message: '数据库登录密码必填!' }]}
          >
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
