import { EngineBanner, utils } from '@antv/gi-sdk';
import { Button, Col, Form, Input, Row } from 'antd';
import * as React from 'react';
import { GI_SERVICE_SCHEMA } from './Initializer';
const { setServerEngineContext, getServerEngineContext } = utils;

export interface ServerProps {
  updateGISite: (params: any) => void;
}

const DEFAULT_INFO = {
  initialQuery: 'https://cdn.jsdelivr.net/npm/@antv/gi-mock-data/cdn/bank.json',
  schemaQuery: '',
  propertiesQuery: '',
  neighborQuery: '',
};

const Server: React.FunctionComponent<ServerProps> = props => {
  const { updateGISite } = props;

  const [form] = Form.useForm();
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    form.setFieldsValue(getServerEngineContext(DEFAULT_INFO));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    const values = await form.validateFields();
    setServerEngineContext(values);
    const schema = await GI_SERVICE_SCHEMA.service();
    const engineContext = {
      engineId: 'MyServer',
      ...values,
    };
    setServerEngineContext(engineContext);
    setLoading(false);
    updateGISite({
      engineId: 'MyServer',
      schemaData: schema,
      engineContext,
    });
  };

  return (
    <div>
      <EngineBanner
        logo="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*XfClS7s1anIAAAAAAAAAAAAADmJ7AQ/original"
        title="自定义服务"
        desc="这个是我的自定义服务，它的引擎 ID 为 MyServer，它将复写原先 G6VP 平台的初始化查询，图模型查询，邻居查询，属性信息查询等服务"
      />
      <Form name="form" form={form}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label="初始化查询"
              name="initialQuery"
              rules={[{ required: true, message: '初始化查询地址，必须填写!' }]}
            >
              <Input placeholder="请输入 初始化查询地址" />
            </Form.Item>
            <Form.Item label="图模型查询" name="schemaQuery">
              <Input placeholder="可以为空，默认前端根据初始化查询数据，自动计算图模型" />
            </Form.Item>
            <Form.Item label="属性查询" name="propertiesQuery">
              <Input placeholder="可以为空，默认将把节点或边的数据展示在属性面板中" />
            </Form.Item>
            <Form.Item label="邻居查询" name="neighborQuery">
              <Input placeholder="可以为空，默认 MOCK 邻居查询数据" />
            </Form.Item>
            <Form.Item>
              <Button style={{ width: '100%' }} onClick={handleStart} type="primary" loading={isLoading}>
                开始分析
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Server;
