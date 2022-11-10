// @ts-nocheck
import { GISiteParams } from '@antv/gi-sdk';
import { Alert, Col, Form, Row, Input } from 'antd';
import React from 'react';
import './index.less';

export interface GraphModelProps {
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
  loading?: boolean;
}
const ConnectNeo4j: React.FC<GraphModelProps> = ({ loading }) => {
  return (
    <Row style={{ paddingTop: 16 }}>
      <Col span={10} className="logo-container">
        <div className="neo4j-logo"></div>
      </Col>
      <Col span={14} className="neo4j-connect-container">
        {loading && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
            message="正在连接 Neo4j 数据库，请耐心等待……"
          />
        )}
        <Form.Item label="URI 地址" name="uri" rules={[{ required: true, message: '部署neo4j的服务器地址必填!' }]}>
          <Input placeholder="请输入 Neo4j URI 服务地址" />
        </Form.Item>
        <Form.Item label="用户名" name="user" rules={[{ required: true, message: '部署neo4j的服务器地址必填!' }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input.Password />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ConnectNeo4j;
