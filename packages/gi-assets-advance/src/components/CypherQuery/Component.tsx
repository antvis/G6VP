import { useContext, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import { Button, Divider } from 'antd';
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
}

const CypherEditorPanel: React.FC<CyperQueryProps> = ({
  serviceId,
  isShowPublishButton,
  saveCypherTemplateServceId = 'GI/PublishTemplate',
}) => {
  const { updateContext, transform, services } = useContext();
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
    });

    updateContext(draft => {
      const res = transform(resultData);
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
      <h4>请输入 Cypher 语句进行查询</h4>
      <CyperEditor onValueChange={getCyperInputValue} />
      <div style={{ textAlign: 'right' }}>
        <Divider />
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
