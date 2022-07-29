import React from "react";
import { Col, Row, Select, Form, Input } from "antd";
const { Item } = Form;
const { Option } = Select;

const ODPSModelPanel = () => {
  return (
    <div>
      <Row
        style={{
          border: "1px solid #ccc",
          padding: 16,
          paddingBottom: 0,
          marginBottom: 16
        }}
      >
        <Col span={22} style={{ marginBottom: 16 }}>
          <h5>ODPS 配置</h5>
        </Col>
        <Col span={8}>
          <Item label="AccessID" name="accessId">
            <Input style={{ width: 150 }} />
          </Item>
        </Col>
        <Col span={8}>
          <Item label="AccessKey" name="accessKey">
            <Input style={{ width: 150 }} />
          </Item>
        </Col>
        <Col span={8}>
          <Item label="Project" name="project" rules={[{ required: true }]}>
            <Input style={{ width: 150 }} />
          </Item>
        </Col>
        <Col span={24}>
          <Item label="EndPoint" name="endpoint">
            <Select style={{ width: 467 }}>
              <Option value="http://service.odps.aliyun-inc.com/api">
                http://service.odps.aliyun-inc.com/api
              </Option>
            </Select>
          </Item>
        </Col>
      </Row>
    </div>
  );
};

export default ODPSModelPanel;
