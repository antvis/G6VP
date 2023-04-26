import { useContext, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import { Button } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import PublishTemplate from '../PublishTemplate';
import CyperEditor from './CyperEditor';
import './index.less';

const icons = Graphin.registerFontFamily(iconLoader);

export interface CyperQueryProps {
  serviceId: string;
  saveCypherTemplateServceId?: string;
  isShowPublishButton?: boolean;
  limit: number;
}

const CypherEditorPanel: React.FC<CyperQueryProps> = ({
  serviceId,
  isShowPublishButton,
  saveCypherTemplateServceId = 'GI/PublishTemplate',
  limit,
}) => {
  const { updateContext, transform, services, largeGraphLimit } = useContext();
  const service = utils.getService(services, serviceId);

  const [state, setState] = useImmer({
    value: '',
    loading: false,
    modalVisible: false,
  });

  const handleQuery = async () => {
    setState(draft => {
      draft.loading = true;
    });

    if (!service) {
      return;
    }

    const resultData = await service({
      value: state.value,
      limit,
    });

    updateContext(draft => {
      const res = transform(resultData);

      if (res.nodes.length > largeGraphLimit) {
        draft.largeGraphMode = true;
        draft.largeGraphData = res;
        draft.source = res;
        draft.data = {
          nodes: [],
          edges: [],
        };
        draft.isLoading = false;
        return;
      }

      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
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
      <CyperEditor onValueChange={getCyperInputValue} />
      <div style={{ textAlign: 'right', padding: '12px 0px' }}>
        {isShowPublishButton && (
          <Button className="publishButton" disabled={!state.value} onClick={handleShowModal}>
            发布成模板
          </Button>
        )}
        <Button onClick={handleQuery} type="primary">
          执行查询
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

export default CypherEditorPanel;
