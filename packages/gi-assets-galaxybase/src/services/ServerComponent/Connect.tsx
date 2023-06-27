import { GISiteParams, utils } from '@antv/gi-sdk';
import { Alert, Button, Form, Input, notification } from 'antd';
import React, { useState } from 'react';
import { CollapseCard } from '../../components-ui';
import { connectGalaxybaseDataSource } from '../GraphService';
import './index.less';
import $i18n from '../../i18n';

export interface ConnectProps {
  updateGISite?: (params: GISiteParams) => void;
  updateToken: () => void;
  giSiteContext?: any;
  token: string | null;
}

const { protocol, hostname } = location;
const DEFAULT_HTTP_SERVICE_URL = `${protocol}//${hostname}:18088`;
const DEFAULT_VALUE = {
  username: '',
  password: '',
  HTTP_SERVICE_URL: DEFAULT_HTTP_SERVICE_URL, //'http://127.0.0.1:7001',
  engineServerURL: '',
  CURRENT_GALAXYBASE_SUBGRAPH: '',
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
    const result = await connectGalaxybaseDataSource();
    setLoading(false);

    if (result) {
      notification.success({
        message: $i18n.get({
          id: 'galaxybase.services.ServerComponent.Connect.ConnectionToDatabaseGalaxybaseSucceeded',
          dm: '连接 Galaxybase 数据库成功',
        }),
        description: $i18n.get({
          id: 'galaxybase.services.ServerComponent.Connect.ContinueToSelectSubgraphsAnd',
          dm: '请继续选择子图，进入分析',
        }),
      });
      updateToken();
    } else {
      notification.error({
        message: $i18n.get({
          id: 'galaxybase.services.ServerComponent.Connect.FailedToConnectToGalaxybase',
          dm: '连接 Galaxybase 数据库失败',
        }),
        style: {
          width: 500,
        },
        description: (
          <>
            {$i18n.get({
              id: 'galaxybase.services.ServerComponent.Connect.CheckWhetherTheAntvisGi',
              dm: '✅ 请检查 antvis/gi-httpservice 镜像是否启动',
            })}
            <br />
            {$i18n.get({
              id: 'galaxybase.services.ServerComponent.Connect.CheckWhetherTheGalaxybaseDatabase',
              dm: '✅ 请检查 Galaxybase 数据库地址，账户，密码是否填写正确',
            })}
          </>
        ),
      });
    }
  };
  const submitMessage = token
    ? $i18n.get({ id: 'galaxybase.services.ServerComponent.Connect.Reconnect', dm: '重新连接' })
    : $i18n.get({ id: 'galaxybase.services.ServerComponent.Connect.StartConnection', dm: '开始连接' });

  return (
    <>
      <CollapseCard
        title={$i18n.get({ id: 'galaxybase.services.ServerComponent.Connect.ConnectToADatabase', dm: '连接数据库' })}
        defaultActive={!Boolean(token)}
      >
        <Form name="gsform" form={form}>
          {loading && (
            <Alert
              type="info"
              showIcon
              style={{ marginTop: 16, marginBottom: 16 }}
              message={$i18n.get({
                id: 'galaxybase.services.ServerComponent.Connect.ConnectingToGalaxybaseDatabasePlease',
                dm: '正在连接 Galaxybase 数据库，请耐心等待……',
              })}
            />
          )}

          <Form.Item
            label={$i18n.get({ id: 'galaxybase.services.ServerComponent.Connect.PlatformAddress', dm: '平台地址' })}
            name="HTTP_SERVICE_URL"
            rules={[
              {
                required: true,
                message: $i18n.get({
                  id: 'galaxybase.services.ServerComponent.Connect.ThePlatformServiceAddressIs',
                  dm: '平台服务地址必填!',
                }),
              },
            ]}
          >
            <Input
              placeholder={$i18n.get({
                id: 'galaxybase.services.ServerComponent.Connect.EnterGiHttpserviceAddress',
                dm: '请输入 gi-httpservice 地址',
              })}
            />
          </Form.Item>
          <Form.Item
            label={$i18n.get({ id: 'galaxybase.services.ServerComponent.Connect.AccountName', dm: '账名' })}
            name="username"
            rules={[
              {
                required: true,
                message: $i18n.get({
                  id: 'galaxybase.services.ServerComponent.Connect.TheDatabaseUserNameIs',
                  dm: '数据库用户名必填!',
                }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={$i18n.get({ id: 'galaxybase.services.ServerComponent.Connect.Password', dm: '密码' })}
            name="password"
            rules={[
              {
                required: true,
                message: $i18n.get({
                  id: 'galaxybase.services.ServerComponent.Connect.TheDatabaseLoginPasswordIs',
                  dm: '数据库登录密码必填!',
                }),
              },
            ]}
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
