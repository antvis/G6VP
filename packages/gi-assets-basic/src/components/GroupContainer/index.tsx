import React, { useEffect, useCallback } from 'react';
import { Form, Button, Row, Col, Collapse, Checkbox, Switch, Input } from 'antd';
import { useImmer } from 'use-immer';
import { PlusOutlined, DeleteOutlined, MinusOutlined } from '@ant-design/icons';
import ExpressionGroup, { Expression } from './ExpressionGroup';
import { filterByTopRule } from './utils';
import './index.less';

export interface ElementTypeOption {
  value: string;
  properties: any[];
}

export interface GroupContainerProps {
  data: any[];
  children?: React.ReactChild;
  valuesChange: (currenr: any, allValues: any) => void;
}

const { Panel } = Collapse;

export interface Condition {
  nodeTypes: string[];
  expressions?: Expression[];
  logic?: boolean;
  groupIndex: number | string;
  checked?: boolean;
}
interface State {
  activeKeys: (string | number)[];
}

const GroupContainer: React.FC<GroupContainerProps> = ({ data, children, valuesChange }) => {
  const [form] = Form.useForm();

  const [state, setState] = useImmer<State>({
    activeKeys: ['0'],
  });
  const { activeKeys } = state;

  const onPanelChange = (keys: string | string[]) => {
    setState(state => {
      state.activeKeys = typeof keys === 'string' ? [keys] : keys;
    });
  };

  const onValuesChange = useCallback((changedValue: any, allValues: any) => {
    console.log('xxx', data, allValues);
    const { groups } = allValues;
    groups.forEach(p => {
      console.log('xxxxdddd', filterByRules(p.expressions, data));
    });
    // console.log(filterByRules())
    if (valuesChange) {
      valuesChange(changedValue, allValues);
    }
  }, []);

  const filterByRules = (conditions, nodes) => {
    if (conditions.length === 0) {
      return;
    }

    const newMembers = conditions.reduce((map, condition, index) => {
      const filteredNodes = nodes.filter(node => {
        const topRule = condition && condition.name && condition.operator ? condition : undefined;
        if (topRule) {
          return filterByTopRule(node.data, topRule);
        } else {
          return false;
        }
      });
      map[index] = { list: filteredNodes.map(node => node.id) };
      return map;
    }, []);

    return newMembers;
  };

  // 构建属性列表
  const propertyList = Object.keys(data[0]).map(d => {
    return {
      value: d,
      key: d,
    };
  });

  return (
    <div className="gi-group-contaner">
      <Form layout="vertical" form={form} onValuesChange={onValuesChange}>
        <Form.Item
          name="groups"
          shouldUpdate={() => true}
          // 最后一项隐藏，解决panel展开问题
          initialValue={[{ groupName: '样式配置分组1' }]}
        >
          <Form.List name="groups">
            {(fields, { add, remove }) => {
              return (
                <>
                  <Collapse expandIconPosition="right" bordered={false} onChange={onPanelChange} activeKey={activeKeys}>
                    {fields.map(({ key, name, ...restField }, index) => {
                      return (
                        <Panel
                          className="gi-group-contaner-panel"
                          key={`${key}`}
                          header={
                            <div className="header">
                              <div className="left" onClick={e => e.stopPropagation()}>
                                <Form.Item {...restField} name={[name, 'groupName']}>
                                  <Input placeholder="请输入样式分组名称" bordered={false} />
                                </Form.Item>
                              </div>
                              {index !== 0 && (
                                <DeleteOutlined
                                  onClick={() => {
                                    remove(name);
                                  }}
                                />
                              )}
                            </div>
                          }
                        >
                          <Row>
                            <Col span={24} className="expression-group">
                              <ExpressionGroup
                                options={propertyList}
                                restField={restField}
                                name={name as any}
                                index={index}
                                form={form}
                              />
                              <div className="switch-button-wrap">
                                <Form.Item name={[name, 'logic']} initialValue={true}>
                                  <Switch
                                    size="small"
                                    className="switch-button"
                                    checkedChildren="and"
                                    unCheckedChildren="or"
                                  />
                                </Form.Item>
                              </div>
                            </Col>
                            <Col>筛选节点列表</Col>
                          </Row>
                          <Row className="xrender-form-container">{children}</Row>
                        </Panel>
                      );
                    })}
                  </Collapse>
                  <Row gutter={20}>
                    {/* <Col span={12}>
                      <Button size="small" style={{ width: '100%' }} onClick={onDeleteGroups} icon={<MinusOutlined />}>
                        删除所有分组
                      </Button>
                    </Col> */}
                    <Col span={24}>
                      <Button
                        size="small"
                        type="primary"
                        style={{ width: '100%' }}
                        onClick={() => {
                          add({ groupName: `样式配置分组${fields.length + 1}` });
                          setState(state => {
                            state.activeKeys = [...activeKeys, `${fields.length}`];
                          });
                        }}
                        icon={<PlusOutlined />}
                      >
                        增加样式配置分组
                      </Button>
                    </Col>
                  </Row>
                </>
              );
            }}
          </Form.List>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GroupContainer;
