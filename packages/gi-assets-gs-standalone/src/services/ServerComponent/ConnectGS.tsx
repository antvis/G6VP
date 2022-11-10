// @ts-nocheck
import { GISiteParams } from '@antv/gi-sdk';
import { Alert, Col, Form, Row, Select, Switch } from 'antd';
import React from 'react';
import './index.less';

const { Option } = Select;

export interface GraphModelProps {
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
  loading?: boolean;
}
const ConnectGraphScope: React.FC<GraphModelProps> = ({ loading }) => {
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
          <Select mode="tags" style={{ width: '100%' }}>
            <Option key="http://127.0.0.1:7001">ttp://127.0.0.1:7001</Option>
            <Option key="http://storehouse-afx-39730.gz00b.dev.alipay.net">GI 开发环境地址「不定时过期」</Option>
            <Option key="http://storehouse.test.alipay.net">GI 测试环境地址</Option>
            <Option key="http://graphinsight-pre.alipay.com">GI 预发环境地址</Option>
            <Option key="http://graphinsight.antgroup-inc.cn">GI 生产环境地址</Option>
          </Select>
          {/* <Input placeholder="请输入提供Gremlin查询的HTTP服务地址，格式为 http://ip:port" /> */}
        </Form.Item>
        <Form.Item
          label="引擎服务地址"
          name="engineServerURL"
          rules={[{ required: true, message: '部署GraphScope的服务器地址必填!' }]}
        >
          <Select mode="tags" style={{ width: '100%' }}>
            <Option key="http://172.17.0.2:9527">http://172.17.0.2:9527</Option>
            <Option key="http://11.166.85.48:9527">蚂蚁线下环境</Option>
            <Option key="http://grape.alibaba-inc.com">阿里线上环境</Option>
          </Select>
          {/* <Input placeholder="请输入部署GraphScope的服务器，格式为 http://ip:port" /> */}
        </Form.Item>
        <Form.Item label="ID字段类型" name="isStringType">
          <Switch defaultChecked checkedChildren="string" unCheckedChildren="int64" />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ConnectGraphScope;
