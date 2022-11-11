import { useContext, utils } from '@antv/gi-sdk';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import { Button, Divider, notification } from 'antd';
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
      // @ts-ignore
      draft.key = Math.random();
      const res = transform(resultData);
      res.nodes.forEach(node => {
        if (!node.style.badges) {
          node.style.badges = [];
        }
        // 保留其他位置的 badges，例如锁定和标签
        node.style.badges = node.style.badges.filter(({ position }) => position !== 'LB') || [];

        const expandIds = resultData.nodes.map(n => n.id);
        if (expandIds.indexOf(node.id) !== -1) {
          node.style.badges.push({
            position: 'LB',
            type: 'font',
            fontFamily: 'graphin',
            value: icons['plus-circle'],
            size: [12, 12],
            color: '#fff',
            fill: '#4DB6AC',
            stroke: '#4DB6AC',
          });
        }
      });

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
