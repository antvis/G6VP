import React, { useEffect } from 'react';
import { Button, Divider, Form, Input, Popover, Tooltip, message } from 'antd';
import { ellipsisString, getValueDOM } from './util';
import { useImmer } from 'use-immer';
import { TemplateData, TemplateNode } from './type';
import './index.less';

export interface ParamterizePanelProps {
  // 模版图数据
  graphData: TemplateData;
  // 正在配置中的模版图节点
  configuring?: TemplateNode;
  // 更新非查询类型记录查询语句参数的一个模版节点的一个字段的参数化
  updateParameterize: (id: string, fieldName: string, parameterize: boolean) => void;
  // 更新查询类型记录的查询语句的一处参数化
  updateQueryParameterize: (
    // 历史记录 id
    id: string,
    // 查询语句的字段名
    fieldNames: string[],
    // 需要参数化的字符串的起始/结束位置，以及这一范围内的原始字符串
    position: { start?: number; end?: number; content: string },
    // 参数化后的参数名（用户命名）
    parameterName: string,
    // 参数化后的参数辅助描述（用户输入）
    parameterDesc?: string,
  ) => void;
  // 更新一个历史记录节点的辅助描述
  updateDescription: (id: string, desc: string) => void;
}

/**
 * 沉淀历史记录模版过程弹窗中，右侧的参数化面板，用户在此编辑每条历史记录中所有参数的参数化
 * @param props
 * @returns
 */
const ParamterizePanel: React.FC<ParamterizePanelProps> = props => {
  const [form] = Form.useForm();
  const { configuring, graphData, updateParameterize, updateQueryParameterize, updateDescription } = props;
  const { content, params, parameterized } = (configuring as any) || {};

  const [state, updateState] = useImmer({
    // 正在被刷选文字的准备进行参数化的 field
    selectingField: undefined as string | string[] | undefined,
    // query 类型的节点，正在进行参数化的 field
    operatingQueryField: undefined as string | undefined,
    // query 类型节点，正在进行参数化的选中部分字符串的信息，包括起点位置、终点位置、选中的文本内容
    operatingQueryValue: undefined as { start?: number; end?: number; content: string } | undefined,
    // 是否增在刷选文字中
    brushing: false as boolean | number,
  });

  const { selectingField, operatingQueryField, operatingQueryValue, brushing } = state;

  useEffect(() => {
    // window 上的鼠标按下/抬起监听，用于清空刷选文字进行参数化的状态
    window.addEventListener('mouseup', handleWindowMouseup);
    window.addEventListener('mousedown', handleWindowMousedown);
    return () => {
      window.removeEventListener('mouseup', handleWindowMouseup);
      window.removeEventListener('mousedown', handleWindowMousedown);
    };
  }, []);

  /**
   * 配置中的节点变更，回填该节点的描述表单
   */
  useEffect(() => {
    if (configuring) {
      form.setFieldValue('description', configuring.description);
    }
  }, [configuring?.id]);

  /**
   * window 上鼠标按下的监听，清除刷选中的状态
   * @param evt
   * @returns
   */
  const handleWindowMousedown = evt => {
    const { className } = evt.target || {};
    if (typeof className === 'string' && className.includes('gi-history-modal-configure-value')) return;

    updateState(draft => {
      draft.brushing = false;
    });

    if (typeof className === 'string' && className.includes('gi-history-modal-configure-panel')) {
      updateState(draft => {
        draft.operatingQueryValue = undefined;
        draft.selectingField = undefined;
      });
    }
  };

  /**
   * Window 上的鼠标抬起监听，清除刷选中的状态，并给出刷选失败提示
   * @returns
   */
  const handleWindowMouseup = () => {
    if (!selectingField || brushing === false) return;
    message.info('刷选文本时，请在参数值文字范围内抬起鼠标以完成参数化');
    updateState(draft => {
      draft.brushing = false;
    });
  };

  /**
   * 参数值 DOM 的 mousedown 响应函数，记录当前正在选择的 fieldName
   * @param fieldName
   * @returns
   */
  const handleMouseDownValue = (fieldName: string | undefined, isPart: boolean, evt) => {
    // 仅针对查询语句进行刷选文字参数化
    if (!isPart) return;
    updateState(draft => {
      draft.operatingQueryValue = undefined;
      draft.selectingField = fieldName;
      draft.brushing = Number(evt.target.getAttribute('data-start')) || 0;
    });
  };

  /**
   * 刷选文本事件的结束，记录被刷选选中的信息
   */
  const handleMouseupValue = evt => {
    if (!selectingField || brushing === false) return;
    const currentTargetStartPosition = Number(evt.target.getAttribute('data-start')) || 0;
    const mouseDownStartPosition = brushing as number;
    // 若与 mousedown 时记录的 startPosition 不一致，则不在同一个连续的文本上，不可参数化
    if (mouseDownStartPosition !== currentTargetStartPosition) {
      message.error('框选请勿跨越已参数化的内容');
      return;
    }
    const range = window.getSelection()?.getRangeAt(0);
    if (!range) return;
    const { startContainer: targetDOM, startOffset, endOffset } = range;
    const length = endOffset - startOffset;
    // 若刷选长度为 0，不进行参数化
    if (length <= 0) return;
    const str = targetDOM.nodeValue?.substring(startOffset, length);
    if (str) {
      updateState(draft => {
        draft.operatingQueryValue = {
          start: startOffset + mouseDownStartPosition,
          end: endOffset + mouseDownStartPosition,
          content: str,
        };
      });
    }
  };

  const handleSelect = (field, selection) => {
    const { name: fieldName, namespace: parentFieldNames, type, value } = selection;
    updateState(draft => {
      draft.selectingField = [field, ...parentFieldNames, fieldName];
      draft.operatingQueryValue = {
        content: value,
      };
    });
    handleClickParameterize(fieldName, true, true);
  };

  /**
   * 该节点的描述内容，包括 statement 和 时间
   * @returns
   */
  const getDescription = () => {
    const { statement, timestamp } = content;
    const date = new Date(timestamp);
    return (
      <div style={{ margin: '8px 0' }}>
        <span className="gi-analysis-history-statement">{statement}</span>
        <div className="gi-analysis-history-time" style={{ fontSize: '10px' }}>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      </div>
    );
  };

  /**
   * 修改该节点的描述文案
   * @param evt
   * @returns
   */
  const handleChangeDescription = evt => {
    if (!configuring) return;
    updateDescription(configuring.id, evt.target.value);
  };

  /**
   * 点击“参数化”按钮的响应函数
   * @param field 字段名
   * @param isParameterize 是否已经被参数化
   * @param isPart 是否部分文字参数化，一般用于查询的查询语句、其他 JSON 类型的参数值
   * @returns
   */
  const handleClickParameterize = (field: string, isParameterize: boolean, isPart?: boolean) => {
    if (!configuring) return;
    if (isPart) {
      // 查询类的参数化，需要弹出 popover 让用户给不同内容起名字
      if (!operatingQueryValue) return;
      updateState(draft => {
        draft.operatingQueryField = field;
      });
    } else {
      updateParameterize(configuring.id, field, isParameterize);
    }
  };

  /**
   * 查询类的参数化 popover 起完名字后，点击“确定”的响应函数，进行参数化
   */
  const handleClickParameterizeQuery = () => {
    if (!operatingQueryValue || !configuring || !selectingField) return;
    form.validateFields().then(values => {
      const { parameterName, parameterDesc } = values;
      const pattern = /^[a-zA-Z][a-zA-Z0-9]*$/;
      if (!pattern.test(parameterName)) {
        message.error('命名失败，变量名必须以字母开头，且不包含特殊字符');
        return;
      }
      if (typeof selectingField !== 'string') {
        const [field, ...paths] = selectingField;
        const pathNames = paths.join(',');
        if (parameterized[field]?.[pathNames]?.find(item => item.parameterName === parameterName)) {
          message.error('命名失败，在一个参数中，不可使用重复的参数命名');
          return;
        }
        updateQueryParameterize(configuring.id, selectingField, operatingQueryValue, parameterName, parameterDesc);
      } else {
        if (parameterized[selectingField]?.find(item => item.parameterName === parameterName)) {
          message.error('命名失败，在一个参数中，不可使用重复的参数命名');
          return;
        }
        updateQueryParameterize(configuring.id, [selectingField], operatingQueryValue, parameterName, parameterDesc);
      }
      updateState(draft => {
        draft.operatingQueryField = undefined;
        draft.operatingQueryValue = undefined;
      });
      form.setFieldValue('parameterName', undefined);
      form.setFieldValue('parameterDesc', undefined);
    });
  };

  return configuring ? (
    <div className="gi-history-modal-configure-panel">
      <h4>{configuring.label}</h4>
      <Divider type="horizontal" style={{ margin: '12px 0' }} />
      {getDescription()}
      <Form form={form}>
        描述：
        <Form.Item name="description">
          <Input
            size="small"
            placeholder="该条历史记录的辅助描述"
            onBlur={handleChangeDescription}
            defaultValue={configuring.description}
          />
        </Form.Item>
        {Object.keys(params).map(fieldName => {
          const value = params[fieldName];
          const isJSON = typeof value === 'object';
          const isPart = (content.type === 'query' && fieldName === 'value') || isJSON;
          let brushTooltip = '';
          if (isJSON) {
            brushTooltip = '点选对象中的值，进行参数化';
          } else if (isPart) {
            brushTooltip = '刷选部分文字进行参数化';
          }
          const hasParameterized = !isPart && parameterized?.[fieldName];
          return (
            <div style={{ marginTop: '12px' }}>
              <div className="gi-history-modal-configure-field">
                <span className="gi-history-modal-configure-parameterize-fieldname">{fieldName}:</span>
                <Popover
                  content={
                    <div>
                      <Form.Item
                        name="parameterName"
                        label="名称(英文)"
                        style={{ width: '100%' }}
                        rules={[
                          {
                            required: true,
                            message: '请为参数命名',
                          },
                        ]}
                      >
                        <Input className="gi-history-modal-parametername-input" placeholder="输入名称" size="small" />
                      </Form.Item>
                      <Form.Item name="parameterDesc" label="描述" style={{ width: '100%' }}>
                        <Input
                          className="gi-history-modal-parametername-input"
                          placeholder="该参数的辅助描述"
                          size="small"
                        />
                      </Form.Item>
                      <div style={{ width: '100%', textAlign: 'right' }}>
                        <Button
                          type="text"
                          size="small"
                          onClick={() => {
                            updateState(draft => {
                              draft.operatingQueryField = undefined;
                            });
                            form.resetFields();
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          className="gi-history-modal-parametername-confirm"
                          style={{ margin: '0px 4px' }}
                          type="primary"
                          size="small"
                          onClick={handleClickParameterizeQuery}
                        >
                          确定
                        </Button>
                      </div>
                    </div>
                  }
                  title={`为即将参数化的"${ellipsisString(operatingQueryValue?.content)}"命名`}
                  trigger="click"
                  open={!!operatingQueryField}
                  onOpenChange={open => {
                    if (!open)
                      updateState(draft => {
                        draft.operatingQueryField = undefined;
                      });
                  }}
                >
                  <Button
                    className="gi-history-modal-configure-parameterize-btn"
                    type="link"
                    disabled={isPart ? !state.operatingQueryValue : false}
                    onClick={() => handleClickParameterize(fieldName, !hasParameterized, isPart)}
                    size="small"
                  >
                    {hasParameterized ? '取消' : '参数化'}
                  </Button>
                </Popover>
              </div>
              <Tooltip title={brushTooltip} placement="leftTop">
                {getValueDOM(configuring, fieldName, {
                  className: 'gi-history-modal-configure-value',
                  onMouseDown: evt => handleMouseDownValue(fieldName, isPart, evt),
                  onMouseUp: handleMouseupValue,
                  onSelect: selection => handleSelect(fieldName, selection),
                  color: hasParameterized ? 'var(--text-color-secondary)' : 'unset',
                })}
              </Tooltip>
            </div>
          );
        })}
      </Form>
    </div>
  ) : (
    <div className="gi-history-modal-configure-panel">
      {graphData?.nodes.length > 2 ? '请点击一个节点进行参数配置' : '请先从左侧时间轴中点选历史记录加入模版图'}
    </div>
  );
};

export default ParamterizePanel;
