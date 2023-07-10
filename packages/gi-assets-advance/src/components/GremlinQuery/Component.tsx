import { useContext, utils } from '@antv/gi-sdk';
import GremlinEditor from 'ace-gremlin-editor';
import { Button, Col, InputNumber, notification, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { nanoid } from 'nanoid';
import './index.less';
import $i18n from '../../i18n';

export interface IGremlinQueryProps {
  initialValue?: string;
  height?: number;
  showGutter?: boolean;
  serviceId: string;
  saveTemplateServceId?: string;
  style?: React.CSSProperties | undefined;
  visible?: boolean;
  isShowPublishButton?: boolean;
  isShowLimit?: boolean;
  isShowTimeout?: boolean;
  controlledValues?: {
    value: string;
  };
}

const GremlinQueryPanel: React.FC<IGremlinQueryProps> = ({
  initialValue = '',
  height = 220,
  serviceId,
  saveTemplateServceId = 'GI/PublishTemplate',
  style,
  visible,
  isShowPublishButton,
  isShowLimit,
  isShowTimeout,
  controlledValues,
}) => {
  const { updateContext, transform, services, updateHistory } = useContext();

  const service = utils.getService(services, serviceId);
  const gremlinFromUrl = utils.searchParamOf('gremlin');

  const [state, setState] = useImmer<{
    editorValue: string;
    isFullScreen: boolean;
    modalVisible: boolean;
    limit: number | null;
    timeout: number | null;
  }>({
    // 优先级: url 参数 > props 参数
    editorValue: gremlinFromUrl || initialValue || '',
    isFullScreen: false,
    modalVisible: false,
    limit: null,
    timeout: null,
  });

  const setEditorValue = val => {
    setState(draft => {
      draft.editorValue = val;
    });
  };
  const { editorValue, isFullScreen, limit, timeout } = state;

  const handleChangeEditorValue = (value: string) => {
    setEditorValue(value);
  };

  const [btnLoading, setBtnLoading] = useState(false);

  const handleClickQuery = async () => {
    setBtnLoading(true);
    if (!service) {
      return;
    }

    let gremlinCode = `${editorValue}`;
    if (limit) {
      gremlinCode = `${gremlinCode}.limit(${limit})`;
    }
    if (timeout) {
      gremlinCode = `${gremlinCode.substring(0, 1)}.with('evaluationTimeout', ${timeout})${gremlinCode.substring(1)}`;
    }

    const result = await service({
      value: gremlinCode,
    });

    updateHistory({
      componentId: 'GremlinQuery',
      type: 'query',
      subType: 'Gremlin',
      statement: gremlinCode,
      success: result && result.success,
      params: {
        value: gremlinCode,
      },
    });

    setBtnLoading(false);
    if (!result || !result.success) {
      notification.error({
        message: $i18n.get({
          id: 'advance.components.GremlinQuery.Component.FailedToExecuteGremlinQuery',
          dm: '执行 Gremlin 查询失败',
        }),
        description: $i18n.get(
          {
            id: 'advance.components.GremlinQuery.Component.FailureReasonResultmessage',
            dm: '失败原因：{resultMessage}',
          },
          { resultMessage: result.message },
        ),
      });
      return;
    }

    updateContext(draft => {
      // @ts-ignore
      const res = transform(result.data);
      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
  };

  useEffect(() => {
    setBtnLoading(false);
  }, [visible]);

  useEffect(() => {
    console.log('editorValue..........', editorValue);
    setEditorValue(editorValue);
  }, []);

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    const { value } = controlledValues || {};
    if (value) {
      setEditorValue(value);
      handleClickQuery();
    }
  }, [controlledValues]);

  return (
    <div className="gi-gremlin-query " style={{ ...style }}>
      <div style={{ border: '1px solid #f6f6f6' }}>
        <GremlinEditor
          initValue={editorValue}
          height={height}
          gremlinId="gi-assets-gremlin"
          onValueChange={value => handleChangeEditorValue(value)}
        />
      </div>

      {isShowLimit ? (
        <div className="gi-gremlin-query-config">
          <Row>
            <Col span={6}>
              <label>Limit: </label>
            </Col>
            <Col span={18}>
              <InputNumber
                min={1}
                max={Infinity}
                value={limit}
                size="small"
                style={{ width: '100%' }}
                onChange={val =>
                  setState(draft => {
                    draft.limit = val;
                  })
                }
              />
            </Col>
          </Row>
          {limit ? (
            <div className="gi-gremlin-query-config-tip">
              {$i18n.get(
                {
                  id: 'advance.components.GremlinQuery.Component.LimitConfigTip',
                  dm: `语句将添加后缀: .limt(${limit})`,
                },
                {
                  value: limit,
                },
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      {isShowTimeout ? (
        <div className="gi-gremlin-query-config">
          <Row>
            <Col span={6}>
              <label>Timeout: </label>
            </Col>
            <Col span={18}>
              <InputNumber
                min={1}
                max={Infinity}
                value={timeout}
                size="small"
                style={{ width: '100%' }}
                onChange={val =>
                  setState(draft => {
                    draft.timeout = val;
                  })
                }
              />
            </Col>
          </Row>
          {timeout ? (
            <div className="gi-gremlin-query-config-tip">
              {$i18n.get(
                {
                  id: 'advance.components.GremlinQuery.Component.TimeoutConfigTip',
                  dm: `语句将添加约束: .with('evaluationTimeout', ${timeout})`,
                },
                {
                  value: timeout,
                },
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          padding: '8px 8px',
        }}
      >
        <Space>
          {/* {isShowPublishButton && ( */}

          <Button className={'publishButton'} disabled>
            {$i18n.get({ id: 'advance.components.GremlinQuery.Component.PublishAsATemplate', dm: '发布成模板' })}
          </Button>

          {/* )} */}
          <Button className={'queryButton'} loading={btnLoading} type="primary" onClick={handleClickQuery}>
            {$i18n.get({ id: 'advance.components.GremlinQuery.Component.ExecuteAQuery', dm: '执行查询' })}
          </Button>
        </Space>
      </div>
      {/* {state.modalVisible && (
         <PublishTemplate
           saveTemplateServceId={saveTemplateServceId}
           visible={state.modalVisible}
           value={editorValue}
           close={() => {
             setState(draft => {
               draft.modalVisible = false;
             });
           }}
           fileType={'GREMLIN'}
         />
        )} */}
    </div>
  );
};

export default GremlinQueryPanel;
