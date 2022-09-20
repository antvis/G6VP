// @ts-nocheck
import { GISiteParams } from '@alipay/graphinsight';
import { Alert, Switch, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState } from 'react';
import './index.less';

const { Option } = Select;
export interface GraphModelProps {
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
}
const ConnectGraphScope: React.FC<GraphModelProps> = ({ updateGISite }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addonBefore, setAddonBefore] = useState('http://');

  const handleSubmitForm = async () => {
    setLoading(true);
    // 使用示例数据

    const values = await form.validateFields();

    const { username, password, serverUrl } = values;

    // 加上传的文件加载仅 GraphScope
    const url = `${addonBefore}${serverUrl}`;
    const result = await connectTuGraphDataSource(username, password, url);

    console.log('TuGraph 连接', result);
    setLoading(false);

    message.success('连接 TuGraph 数据源成功');

    // const p1 = GI_SERVICE_INTIAL_GRAPH.service();
    // const p2 = GI_SERVICE_SCHEMA.service({ graphName: 'default' });
    // Promise.all([p1, p2]).then(values => {
    //   const [_data, schema] = values;
    //   updateGISite &&
    //     updateGISite({
    //       engineId: 'TuGraph',
    //       schemaData: schema,
    //       engineContext: {},
    //       /**
    //        * GI平台上会localStorage.setItem('SERVER_ENGINE_CONTEXT',JSON.stringify(engineContext))
    //        * 因此，在接口层，只需要调用 localStorage.getItem('SERVER_ENGINE_CONTEXT') 即可拿到服务上下文
    //        */
    //     });
    // });

    // onClose();
  };

  const handleChange = value => {
    setAddonBefore(value);
  };

  const selectBefore = (
    <Select defaultValue="http://" className="select-before" onChange={handleChange}>
      <Option value="http://">http://</Option>
      <Option value="https://">https://</Option>
    </Select>
  );

  return (
    <Row style={{ paddingTop: 16 }}>
      <Col span={10} className="logo-container">
        <div className="graphscope-logo"></div>
      </Col>
      <Col span={14} className="graphscope-connect-container">
        {loading && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
            message="正在连接 TuGraph 数据库，请耐心等待……"
          />
        )}
        <Form.Item
          label="平台HTTP地址"
          name="httpServerURL"
          rules={[{ required: true, message: '部署GraphScope的服务器地址必填!' }]}
        >
          <Input addonBefore={selectBefore} placeholder="请输入提供Gremlin查询的HTTP服务地址，格式为 ip:port" />
        </Form.Item>
        <Form.Item
          label="引擎服务地址"
          name="engineServerURL"
          rules={[{ required: true, message: '部署GraphScope的服务器地址必填!' }]}
        >
          <Input addonBefore={selectBefore} placeholder="请输入部署GraphScope的服务器，格式为 ip:port" />
        </Form.Item>
        <Form.Item label="ID字段类型" name="isStringType">
          <Switch defaultChecked checkedChildren="string" unCheckedChildren="int64" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ConnectGraphScope;
