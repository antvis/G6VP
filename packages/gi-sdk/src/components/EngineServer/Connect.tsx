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
}

const { protocol, hostname } = location;
const DEFAULT_HTTP_SERVICE_URL = `${protocol}//${hostname}:7001`;
const DEFAULT_VALUE = {
  username: '',
  password: '',
  HTTP_SERVICE_URL: DEFAULT_HTTP_SERVICE_URL, //'http://127.0.0.1:7001',
  engineServerURL: '',
  CURRENT_SUBGRAPH: '',
};

const Connect: React.FC<ConnectProps> = ({ updateToken, token, engineId, connectDatabase, isSocketConnect }) => {
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
              label="G6VP 服务"
              name="HTTP_SERVICE_URL"
              rules={[{ required: true, message: 'G6VP 平台服务地址必填!' }]}
            >
              <Input placeholder="请输入 gi-httpservice 地址" />
            </Form.Item>
          )}
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
