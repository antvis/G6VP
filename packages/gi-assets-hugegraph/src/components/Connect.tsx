import { utils } from '@antv/gi-sdk';
import { Alert, Button, Form, Input, notification } from 'antd';
import React, { useState } from 'react';
import { connectHugeGraphService } from '../services/HugeGraphService';
import CollapseCard from './CollapseCard';

import './index.less';

export interface ConnectProps {
  updateToken: () => void;
  token: string | null;
}

const DEFAULT_VALUE = {
  httpServerURL: 'http://127.0.0.1:7001',
  uri: '',
  username: '',
  password: '',
};

const ConnectHugeGraph: React.FC<ConnectProps> = ({ updateToken, token }) => {
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
    const result = await connectHugeGraphService();

    setLoading(false);

    if (result) {
      notification.success({
        message: '连接 HugeGraph 数据源成功',
        description: '请继续进入分析',
      });
      updateToken();
    } else {
      notification.error({
        message: '连接 HugeGraph 数据库失败',
        style: {
          width: 500,
        },
        description: (
          <>
            ✅ 请检查 HugeGraph 数据库实例是否启动 <br />✅ 请检查 HugeGraph 数据库地址，账户，密码是否填写正确
          </>
        ),
      });
    }
  };
  const submitMessage = token ? '重新连接' : '开始连接';

  return (
    <CollapseCard title="连接数据库" defaultActive={!Boolean(token)}>
      <Form name="hugegraphform" form={form}>
        {loading && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
            message="正在连接 HugeGraph 数据库，请耐心等待……"
          />
        )}
        <Form.Item label="服务" name="httpServerURL" rules={[{ required: true, message: '平台服务http地址必填!' }]}>
          <Input placeholder="请输入平台http服务地址" />
        </Form.Item>
        <Form.Item label="URI" name="uri" rules={[{ required: true, message: '部署 HugeGraph 的服务器地址必填!' }]}>
          <Input placeholder="请输入 HugeGraph URI 服务地址" />
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
  );
};

export default ConnectHugeGraph;
