import React from "react";
import { Col, Row, Alert, Form, Button, Input, Upload } from "antd";
import {
  MinusCircleOutlined,
  UploadOutlined,
  PlusOutlined
} from "@ant-design/icons";

const { Item } = Form;

const fileProps = {
  beforeUpload: () => false
};

const LocalFilePanel = () => {
  return (
    <Col span={24}>
      <Alert
        message={
          <span>
            请确保CSV文件格式正确，如果值为字符串，需要添加引号，具体请参数
            <a href="https://www.jianshu.com/p/fd1b4cd6d31d">
              如何为Excel单元格字符串前后批量添加引号
            </a>
          </span>
        }
        type="info"
        showIcon
        style={{ margin: "0px 0px 16px 0" }}
      />
      <Row>
        <Col span={11} style={{ marginRight: 24 }}>
          <h4>点配置列表</h4>
          <Form.List name="nodeConfigList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      border: "1px solid #ccc",
                      padding: 16,
                      paddingBottom: 0,
                      marginBottom: 16
                    }}
                  >
                    <Col span={22} style={{ marginBottom: 16 }}>
                      <h5>第 {index + 1} 组点配置</h5>
                    </Col>
                    {index !== 0 && (
                      <Col
                        span={2}
                        style={{ textAlign: "right", fontSize: 16 }}
                      >
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      </Col>
                    )}
                    <Col span={12}>
                      <Item label="点类型" name={[field.name, "nodeType"]}>
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item
                        label="点数据文件"
                        name={[field.name, "nodeFileList"]}
                      >
                        <Upload {...fileProps} name="nodes" maxCount={1}>
                          <Button icon={<UploadOutlined />}>上传点文件</Button>
                        </Upload>
                      </Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    增加点配置
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
        <Col span={12}>
          <h4>边配置列表</h4>
          <Form.List name="edgeConfigList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      border: "1px solid #ccc",
                      padding: 16,
                      paddingBottom: 0,
                      marginBottom: 16
                    }}
                  >
                    <Col span={22} style={{ marginBottom: 16 }}>
                      <h5>第 {index + 1} 组边配置</h5>
                    </Col>
                    <Col span={2} style={{ textAlign: "right", fontSize: 16 }}>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Col>
                    <Col span={12}>
                      <Item label="边文件类型" name={[field.name, "edgeType"]}>
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item
                        label="边数据文件"
                        name={[field.name, "edgeFileList"]}
                      >
                        <Upload {...fileProps} name="edges" maxCount={1}>
                          <Button icon={<UploadOutlined />}>上传边文件</Button>
                        </Upload>
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item
                        label="边起点类型"
                        name={[field.name, "sourceNodeType"]}
                      >
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item
                        label="边终点类型"
                        name={[field.name, "targetNodeType"]}
                      >
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    增加边配置
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </Col>
  );
};

export default LocalFilePanel;
