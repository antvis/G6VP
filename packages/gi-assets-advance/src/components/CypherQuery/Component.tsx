import { useContext, utils } from '@antv/gi-sdk';

import { Button } from 'antd';
import React, { memo, useEffect } from 'react';
import { useImmer } from 'use-immer';
import $i18n from '../../i18n';
import PublishTemplate from '../PublishTemplate';
import CyperEditor from './CyperEditor';
import './index.less';

export interface CyperQueryProps {
  serviceId: string;
  saveCypherTemplateServceId?: string;
  isShowPublishButton?: boolean;
  limit: number;
  controlledValues?: {
    value: string;
  };
  onOpen?: () => void;
}

const CypherEditorPanel: React.FC<CyperQueryProps> = ({
  serviceId,
  isShowPublishButton,
  saveCypherTemplateServceId = 'GI/PublishTemplate',
  limit,
  controlledValues,
  onOpen,
}) => {
  const { updateContext, updateHistory, transform, services, largeGraphLimit } = useContext();
  const service = utils.getService(services, serviceId);

  const [state, setState] = useImmer({
    value: '',
    loading: false,
    modalVisible: false,
    inputValue: '',
  });

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      onOpen?.();
      const { value } = controlledValues;
      getCyperInputValue(value);
      handleQuery(value);
      setState(draft => {
        draft.inputValue = value;
      });
    }
  }, [controlledValues]);

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory = (success, errorMsg, value) => {
    updateHistory({
      componentId: 'CypherQuery',
      type: 'query',
      subType: 'Cypher',
      statement: value,
      success,
      errorMsg,
      params: {
        value: value,
      },
    });
  };

  const handleQuery = async (value?: string) => {
    if (!service) {
      return;
    }

    setState(draft => {
      draft.loading = true;
    });

    let statement = value || state.value;
    const resultData = await service({
      value: statement,
      limit,
    });

    const success = !!resultData.nodes;
    const message = success
      ? undefined
      : $i18n.get({ id: 'advance.components.CypherQuery.Component.QueryFailed', dm: '查询失败' });
    handleUpateHistory(success, message, statement);
    setState(draft => {
      draft.loading = false;
    });
    updateContext(draft => {
      const res = transform(resultData);
      draft.source = res;
      draft.isLoading = false;

      if (res.nodes.length > largeGraphLimit) {
        draft.largeGraphMode = true;
        draft.largeGraphData = res;
        draft.data = {
          nodes: [],
          edges: [],
        };
        return;
      }
      draft.data = res;
    });
  };

  const getCyperInputValue = value => {
    setState(draft => {
      draft.value = value;
    });
  };

  const handleShowModal = () => {
    setState(draft => {
      draft.modalVisible = true;
    });
  };

  return (
    <div className="cypher-query-container">
      <CyperEditor
        onValueChange={getCyperInputValue}
        inputValue={state.inputValue}
        cancelInputValue={() =>
          setState(draft => {
            draft.inputValue = '';
          })
        }
      />

      <div style={{ textAlign: 'right', padding: '12px 0px' }}>
        {isShowPublishButton && (
          <Button className="publishButton" disabled={!state.value} onClick={handleShowModal}>
            {$i18n.get({ id: 'advance.components.CypherQuery.Component.PublishAsATemplate', dm: '发布成模板' })}
          </Button>
        )}

        <Button onClick={() => handleQuery()} type="primary" loading={state.loading}>
          {$i18n.get({ id: 'advance.components.CypherQuery.Component.ExecuteAQuery', dm: '执行查询' })}
        </Button>
      </div>
      {state.modalVisible && (
        <PublishTemplate
          saveTemplateServceId={saveCypherTemplateServceId}
          visible={state.modalVisible}
          value={state.value}
          close={() => {
            setState(draft => {
              draft.modalVisible = false;
            });
          }}
          fileType={'CYPHER'}
        />
      )}
    </div>
  );
};

export default memo(CypherEditorPanel);
