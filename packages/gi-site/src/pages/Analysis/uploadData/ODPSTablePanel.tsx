import React from 'react';
import { Col, Row, Alert, Form, Button, Input, Upload, Select } from 'antd';
import { MinusCircleOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select;

const { Item } = Form;

const ODPSTablePanel = () => {
  return (
    <Col span={24}>
      <Alert
        message="请按要求填写ODPS点表和边表信息，如果确认无误，点击载图则会将ODPS表数据载入到GraphScope引擎中"
        type="info"
        showIcon
        style={{ margin: '12px 0px' }}
      />
      <Row>
        <Col span={11} style={{ marginRight: 24 }}>
          <h4>点表配置列表</h4>
          <Form.List name="nodeConfigList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      border: '1px solid #ccc',
                      padding: 16,
                      paddingBottom: 0,
                      marginBottom: 16,
                    }}
                  >
                    <Col span={22} style={{ marginBottom: 16 }}>
                      <h5>第 {index + 1} 组点表配置</h5>
                    </Col>
                    {index !== 0 && (
                      <Col span={2} style={{ textAlign: 'right', fontSize: 16 }}>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Col>
                    )}
                    <Col span={12}>
                      <Item label="点类型" name={[field.name, 'nodeType']}>
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="ID字段" name={[field.name, 'idField']}>
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={24}>
                      <Item label="表名称" name={[field.name, 'tableNames']}>
                        <Select mode="tags" style={{ width: 325 }} placeholder="请输入表名">
                          {/* {children} */}
                        </Select>
                      </Item>
                    </Col>
                    <Col span={24}>
                      <Item label="表分区" name={[field.name, 'partitionName']}>
                        <Input style={{ width: 325 }} />
                      </Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    增加点表配置
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
        <Col span={12}>
          <h4>边表配置列表</h4>
          <Form.List name="edgeConfigList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      border: '1px solid #ccc',
                      padding: 16,
                      paddingBottom: 0,
                      marginBottom: 16,
                    }}
                  >
                    <Col span={22} style={{ marginBottom: 16 }}>
                      <h5>第 {index + 1} 组边表配置</h5>
                    </Col>
                    <Col span={2} style={{ textAlign: 'right', fontSize: 16 }}>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Col>
                    <Col span={12}>
                      <Item label="边类型" name={[field.name, 'edgeType']}>
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="表分区" name={[field.name, 'partitionName']}>
                        <Input style={{ width: 125 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="起点类型" name={[field.name, 'sourceNodeType']}>
                        <Input style={{ width: 111 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="终点类型" name={[field.name, 'targetNodeType']}>
                        <Input style={{ width: 111 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="起点字段" name={[field.name, 'srcField']}>
                        <Input style={{ width: 111 }} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item label="终点字段" name={[field.name, 'dstField']}>
                        <Input style={{ width: 111 }} />
                      </Item>
                    </Col>
                    <Col span={24}>
                      <Item label="边表名称" name={[field.name, 'tableNames']}>
                        <Select mode="tags" style={{ width: 333 }} placeholder="请输入表名">
                          {/* {children} */}
                        </Select>
                      </Item>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    增加边表配置
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

export default ODPSTablePanel;
