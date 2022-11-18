import { GISiteParams } from '@antv/gi-sdk';
import { Alert, Button, Col, Form, Input, notification, Row } from 'antd';
import React, { useState } from 'react';
import { CollapseCard } from '../../components-ui';
import { connectTuGraphDataSource } from '../TuGraphService';
import './index.less';
import { getConnectInfo, setConnectInfo } from './utils';

export interface ConnectProps {
  updateGISite?: (params: GISiteParams) => void;
  updateToken: () => void;
  giSiteContext?: any;
  token: string | null;
}
const Connect: React.FC<ConnectProps> = ({ updateGISite, updateToken, token }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    form.setFieldsValue(getConnectInfo());
  }, []);

  const handleSubmitForm = async () => {
    setLoading(true);

    const values = await form.validateFields().catch(() => {
      setLoading(false);
    });
    if (!values) {
      return;
    }

    const { username, password, serverUrl } = values;

    const result = await connectTuGraphDataSource(username, password, serverUrl);
    setLoading(false);
    setConnectInfo(values);
    if (result) {
      notification.success({
        message: '连接 TuGraph 数据源成功',
        description: '请继续选择子图，进入分析',
      });
      updateToken();
    } else {
      notification.error({
        message: '连接 TuGraph 数据库失败',
        style: {
          width: 500,
        },
        description: (
          <>
            ✅ 请检查 antvis/graph_vis_service 镜像是否启动 <br />✅ 请检查 TuGraph 数据库地址，账户，密码是否填写正确
          </>
        ),
      });
    }
  };
  const submitMessage = token ? '重新连接' : '开始连接';

  return (
    <CollapseCard title="连接数据库" defaultActive={!Boolean(token)}>
      <Row>
        <Col span={12} className="logo-container">
          <img
            width={'100%'}
            style={{
              border: '2px dashed #1665ff',
            }}
            src="https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ"
            alt=""
          />
        </Col>
        <Col span={12} className="tugraph-form-container">
          <Form name="gsform" form={form}>
            {loading && (
              <Alert
                type="info"
                showIcon
                style={{ marginTop: 16, marginBottom: 16 }}
                message="正在连接 TuGraph 数据库，请耐心等待……"
              />
            )}
            <Form.Item label="地址" name="serverUrl" rules={[{ required: true, message: '数据库地址必填!' }]}>
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
        </Col>
      </Row>
    </CollapseCard>
  );
};

export default Connect;
