import { DeleteOutlined, FieldNumberOutlined, FieldStringOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Col, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';
import { getOperatorList } from './utils';

import './expressionGroup.less';

export type Operator = 'contain' | 'not-contain' | 'eql' | 'not-eql' | 'gt' | 'lt' | 'gte' | 'lte';

export interface Expression {
  name: string;
  operator: Operator;
  value: string | number;
}

const ExpressionGroup: React.FunctionComponent<{
  index: number;
  form: any;
  name: string;
  options: any[];
}> = ({ index, form, name, options }) => {
  const content = (
    <Form.Item name={[name, 'expressions']} label="属性过滤">
      <Form.List name={[name, 'expressions']}>
        {(fields, { add, remove }) => {
          const { expressions } = form.getFieldValue('groups')[index] || {};
          return (
            <>
              {fields.map(({ key, name, ...restField }, conditionIndex) => {
                const { name: property } = expressions[conditionIndex] || {};
                // 根据类型判断 property 具体类型
                const propertyType = (property || '').split('-')[1] || 'string';
                return (
                  <Row align="middle" gutter={8} className="item" key={key}>
                    <Col span={2}>
                      {propertyType === 'string' && <FieldStringOutlined />}
                      {(propertyType === 'long' || propertyType === 'double') && <FieldNumberOutlined />}
                    </Col>
                    <Col span={7}>
                      <Form.Item {...restField} name={[name, 'name']}>
                        <Select size="small" style={{ width: '100%' }} options={options} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...restField} name={[name, 'operator']}>
                        <Select size="small" options={getOperatorList(propertyType)} />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item {...restField} name={[name, 'value']}>
                        {propertyType === 'string' ? (
                          <Input size="small" />
                        ) : (
                          <InputNumber size="small" style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                    {conditionIndex !== 0 && (
                      <Col span={2}>
                        <DeleteOutlined onClick={() => remove(name)} />
                      </Col>
                    )}
                  </Row>
                );
              })}

              <Row gutter={8}>
                <Col span={24}>
                  <Button
                    className="addExpressionButton"
                    size="small"
                    onClick={() => {
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加属性
                  </Button>
                </Col>
              </Row>
            </>
          );
        }}
      </Form.List>
    </Form.Item>
  );

  return <div className="expressionGroupContainer">{content}</div>;
};

export default ExpressionGroup;
