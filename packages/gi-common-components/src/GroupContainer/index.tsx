import { CaretRightOutlined, DeleteOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Form, Input, Row, Switch } from 'antd';
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';
import type { ItemConfig } from '../CommonStyleSetting/typing';
import ExpressionGroup, { Expression } from './ExpressionGroup';
import './index.less';
import PopoverContainer from './PopoverContainer';
export interface ElementTypeOption {
  value: string;
  properties: any[];
}

export interface GroupContainerProps {
  data: any[];
  children?: any;
  initValues?: any;
  valuesChange: (currenr: any, allValues: any) => void;
  defaultGroupOption: ItemConfig;
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
  const { data, children, valuesChange, initValues, defaultGroupOption } = props;
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

  const propertyList =
    (p &&
      Object.keys(p).map(d => {
        return {
          value: d,
          key: d,
        };
      })) ||
    [];

  return (
    /** 让fixed定位从该容器开始 */
    <div className="gi-group-contaner" style={{ transform: 'scale(1)', height: '100%' }}>
      <Form
        style={{ overflow: 'scroll', height: 'calc(100% - 30px)' }}
        initialValues={initValues}
        layout="vertical"
        form={form}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="groups"
          shouldUpdate={() => true}
          initialValue={[{ groupName: '样式配置分组1', groupId: 'default-group', id: 'SimpleNode', props: {} }]}
        >
          <Form.List name="groups">
            {(fields, { add, remove }) => {
              return (
                <>
                  <Button
                    type="primary"
                    style={{
                      width: '100%',
                      borderRadius: '4px',
                      position: 'fixed',
                      zIndex: 999,
                      left: '0px',
                      bottom: '12px',
                    }}
                    className="gi-tour-style-add-group"
                    onClick={() => {
                      const idx = fields.length + 1;
                      const options = {
                        ...defaultGroupOption,
                        groupName: `自定义样式 ${idx}`,
                      };
                      add(options);
                      setState(state => {
                        state.activeKeys = [...activeKeys, `${fields.length}`];
                      });
                    }}
                    icon={<PlusOutlined />}
                  >
                    新增样式分组
                  </Button>

                  <Collapse
                    // collapsible="header"
                    className="gi-sidebar-collapse"
                    bordered={false}
                    onChange={onPanelChange}
                    activeKey={activeKeys}
                    expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  >
                    {fields.map(({ key, name, ...restField }, index) => {
                      const panelKey = `${key}`;
                      const isActive = activeKeys.indexOf(panelKey) !== -1;
                      const item = initValues['groups'][key];
                      let color = '#ddd';
                      if (item && item.props) {
                        color = item.props.color;
                      }

                      const DisplayColor = isActive ? null : (
                        <Button
                          size="small"
                          type="text"
                          style={{
                            width: '24px',
                            height: '24px',
                            padding: ' 0px 0px',
                            fontSize: '14px',
                            borderRadius: '2px',
                            verticalAlign: '-3px',
                          }}
                        >
                          <div
                            style={{
                              display: 'block',
                              width: '14px',
                              height: '14px',
                              background: color,
                              borderRadius: '50%',
                              marginLeft: '3px',
                            }}
                          ></div>
                        </Button>
                      );
                      return (
                        <Panel
                          className="gi-group-contaner-panel"
                          key={`${key}`}
                          extra={
                            <div
                              style={{
                                display: 'inline-block',
                                verticalAlign: 'top',
                                height: '32px',
                                lineHeight: '32px',
                              }}
                              onClick={e => {
                                // If you don't want click extra trigger collapse, you can prevent this:
                                e.stopPropagation();
                              }}
                            >
                              {DisplayColor}
                              <PopoverContainer
                                title="分组规则"
                                content={
                                  <Row>
                                    <Col span={24} className="expression-group" style={{ display: 'flex' }}>
                                      <ExpressionGroup
                                        options={propertyList}
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
                                  </Row>
                                }
                              >
                                <Button
                                  className={`gi-tour-style-rule-${index}`}
                                  type="text"
                                  icon={<FilterOutlined />}
                                  size="small"
                                ></Button>
                              </PopoverContainer>
                              
                              <Button
                                type="text"
                                disabled={index === 0}
                                icon={
                                  <DeleteOutlined
                                    onClick={() => {
                                      remove(name);
                                    }}
                                  />
                                }
                                size="small"
                              ></Button>
                            </div>
                          }
                          header={
                            <div className="header">
                              <div className="left" onClick={e => e.stopPropagation()}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'groupName']}
                                  className="gi-group-container-panel-header"
                                >
                                  <Input placeholder="请输入样式分组名称" bordered={false} />
                                </Form.Item>
                              </div>
                            </div>
                          }
                        >
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
