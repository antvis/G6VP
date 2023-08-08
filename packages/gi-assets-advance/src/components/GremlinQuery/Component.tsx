import { useContext, utils } from '@antv/gi-sdk';
import GremlinEditor from 'ace-gremlin-editor';
import { Button, Col, InputNumber, notification, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
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
  const constainerRef = React.useRef<null | HTMLDivElement>(null);

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
    timeout: 5000,
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

  const editorValueHasLimit = useMemo(() => editorValue.includes('.limit'), [editorValue]);
  const editorValueHasTimeout = useMemo(() => editorValue.includes('evaluationTimeout'), [editorValue]);

  const handleClickQuery = async () => {
    setBtnLoading(true);
    if (!service) {
      return;
    }

    let gremlinCode = `${editorValue}`;
    if (isShowLimit && limit && !editorValueHasLimit) {
      gremlinCode = `${gremlinCode}.limit(${limit})`;
    }
    if (isShowTimeout && timeout && !editorValueHasTimeout) {
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

  const hasConstraint = isShowLimit || isShowTimeout;

  const constraintsHorizontal = useMemo(() => {
    if (!constainerRef.current?.scrollWidth) return false;
    if (constainerRef.current?.scrollWidth > 400) {
      return true;
    }
    return false;
  }, [constainerRef.current?.scrollWidth]);

  const limitConstraint = isShowLimit ? (
    <div className="gi-gremlin-query-config" style={{ width: constraintsHorizontal ? '50%' : 'unset' }}>
      <Tooltip
        title={
          editorValueHasLimit
            ? $i18n.get({
                id: 'advance.components.GremlinQuery.Component.CannotBeModifiedLimitNum',
                dm: '不可修改，语句中已有 .limit(num) 约束',
              })
            : ''
        }
      >
        <div className="gi-gremlin-query-constraint-constraint">
          <label className="gi-gremlin-query-constraint-label">Limit: </label>
          <InputNumber
            min={1}
            max={Infinity}
            value={editorValueHasLimit ? undefined : limit}
            size="small"
            style={{ width: 'calc(100% - 80px)' }}
            disabled={editorValueHasLimit}
            onChange={val =>
              setState(draft => {
                draft.limit = val;
              })
            }
          />
        </div>
      </Tooltip>
      {limit && !editorValueHasLimit ? (
        <div className="gi-gremlin-query-config-tip">
          {$i18n.get(
            {
              id: 'advance.components.GremlinQuery.Component.LimitConfigTip',
              dm: $i18n.get(
                {
                  id: 'advance.components.GremlinQuery.Component.TheStatementAddsASuffix',
                  dm: '语句将添加后缀: .limt({limit})',
                },
                { limit: limit },
              ),
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
  );

  const timeoutConstraint = isShowTimeout ? (
    <div className="gi-gremlin-query-config" style={{ width: constraintsHorizontal ? '50%' : 'unset' }}>
      <Tooltip
        title={
          editorValueHasTimeout
            ? $i18n.get({
                id: 'advance.components.GremlinQuery.Component.CannotBeModifiedWithEvaluationtimeout',
                dm: "不可修改，语句中已有 .with('evaluationTimeout', timeout) 约束",
              })
            : ''
        }
      >
        <div className="gi-gremlin-query-constraint-constraint">
          <label className="gi-gremlin-query-constraint-label">Timeout(ms): </label>
          <InputNumber
            min={500}
            max={Infinity}
            step={1000}
            value={editorValueHasTimeout ? undefined : timeout}
            size="small"
            disabled={editorValueHasTimeout}
            style={{ width: 'calc(100% - 80px)' }}
            onChange={val =>
              setState(draft => {
                draft.timeout = val;
              })
            }
          />
        </div>
      </Tooltip>
      {timeout && !editorValueHasTimeout ? (
        <div className="gi-gremlin-query-config-tip">
          {$i18n.get(
            {
              id: 'advance.components.GremlinQuery.Component.TimeoutConfigTip',
              dm: $i18n.get(
                {
                  id: 'advance.components.GremlinQuery.Component.StatementToAddConstraintsWith',
                  dm: "语句将添加约束: .with('evaluationTimeout', {timeout})",
                },
                { timeout: timeout },
              ),
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
  );

  return (
    <div className="gi-gremlin-query " style={{ ...style }} ref={constainerRef}>
      <div style={{ border: '1px solid #f6f6f6' }}>
        <GremlinEditor
          initValue={editorValue}
          height={height}
          gremlinId="gi-assets-gremlin"
          onValueChange={value => handleChangeEditorValue(value)}
        />
      </div>

      {hasConstraint ? (
        <div
          className="gi-gremlin-query-constraints-wrapper"
          style={{ display: constraintsHorizontal ? 'inline-flex' : 'block' }}
        >
          {limitConstraint}
          {timeoutConstraint}
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
