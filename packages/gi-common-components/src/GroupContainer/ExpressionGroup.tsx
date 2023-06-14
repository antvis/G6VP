import {
  DeleteOutlined,
  FieldNumberOutlined,
  FieldStringOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [internalOptions, setInternalOptions] = useState(options);
  // 支持自定义属性
  const handleNameSearch = (value: string) => {
    if (!value) {
      setInternalOptions(options);
      return;
    }
    const newOptions = options.filter(option => option.value.includes(value));
    setInternalOptions([
      {
        label: value,
        value,
      },
      ...newOptions,
    ]);
  };

  const getPropertyType = (propertyName: string) => {
    return options.find(option => option.value === propertyName)?.type || 'unknown';
  };

  useEffect(() => {
    if (options?.length) setInternalOptions(options);
  }, [options]);

  const content = (
    <Form.Item name={[name, 'expressions']} label="属性过滤" tooltip={'支持自定义属性路径，例: a.b.c'}>
      <Form.List name={[name, 'expressions']}>
        {(fields, { add, remove }) => {
          const { expressions } = form.getFieldValue('groups')[index] || {};
          return (
            <>
              {fields.map(({ key, name, ...restField }, conditionIndex) => {
                const { name: property } = expressions[conditionIndex] || {};
                // 根据类型判断 property 具体类型
                const propertyType = getPropertyType(property);
                return (
                  <Row align="middle" gutter={8} className="item" key={key}>
                    <Col span={2}>
                      {propertyType === 'string' && <FieldStringOutlined />}
                      {propertyType === 'number' && <FieldNumberOutlined />}
                      {propertyType === 'unknown' && <FileTextOutlined />}
                    </Col>
                    <Col span={7}>
                      <Form.Item {...restField} name={[name, 'name']}>
                        <Select
                          size="small"
                          showSearch
                          onSearch={handleNameSearch}
                          style={{ width: '100%' }}
                          options={internalOptions}
                        />
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
