import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Form, Input, Row, Switch } from 'antd';
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';
import ExpressionGroup, { Expression } from './ExpressionGroup';
import './index.less';

export interface ElementTypeOption {
  value: string;
  properties: any[];
}

export interface GroupContainerProps {
  data: any[];
  children?: any;
  initValues?: any;
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
export interface State {
  activeKeys: (string | number)[];
}

const GroupContainer: React.FC<GroupContainerProps> = props => {
  const { data, children, valuesChange, initValues } = props;
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
    console.log('form value change', allValues);
    if (valuesChange) {
      valuesChange(changedValue, allValues);
    }
  }, []);

  // 构建属性列表
  const p = data[0] && data[0].data;
  const propertyList = Object.keys(p).map(d => {
    return {
      value: d,
      key: d,
    };
  });

  return (
    <div className="gi-group-contaner">
      <Form initialValues={initValues} layout="vertical" form={form} onValuesChange={onValuesChange}>
        <Form.Item
          name="groups"
          shouldUpdate={() => true}
          // 最后一项隐藏，解决panel展开问题
          initialValue={[{ groupName: '样式配置分组1', groupId: 'default-group', id: 'SimpleNode', props: {} }]}
        >
          <Form.List name="groups">
            {(fields, { add, remove }) => {
              return (
                <>
                  <Row gutter={20}>
                    <Col span={24}>
                      <Button
                        size="small"
                        type="primary"
                        style={{ width: '100%' }}
                        onClick={() => {
                          add({
                            groupName: `样式配置分组${fields.length + 1}`,
                            groupId: Math.random()
                              .toString(36)
                              .slice(-8),
                            id: 'SimpleNode',
                            props: {},
                          });
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
                              <ExpressionGroup options={propertyList} name={name as any} index={index} form={form} />
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
                          </Row>
                          <Col span={24} className="xrender-form-container">
                            {children(index)}
                          </Col>
                        </Panel>
                      );
                    })}
                  </Collapse>
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
