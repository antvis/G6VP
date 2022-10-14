import { useContext, utils } from '@alipay/graphinsight';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import { Button, notification } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import CyperEditor from './CyperEditor';

const icons = Graphin.registerFontFamily(iconLoader);

export interface CyperQueryProps {
  serviceId: string;
}

const CypherEditorPanel: React.FC<CyperQueryProps> = ({ serviceId }) => {
  const { updateContext, transform, services } = useContext();
  const service = utils.getService(services, serviceId);

  const [state, setState] = useImmer({
    value: '',
    loading: false,
  });

  const handleQuery = async () => {
    setState(draft => {
      draft.loading = true;
    });

    if (!service) {
      return;
    }

    const result = await service({
      value: state.value,
    });

    if (!result || !result.success) {
      notification.error({
        message: '执行 Cypher 查询失败',
        description: `查询失败：${result.message}`,
      });
      return;
    }

    updateContext(draft => {
      // @ts-ignore
      draft.key = Math.random();
      const res = transform(result.data);
      res.nodes.forEach(node => {
        if (!node.style.badges) {
          node.style.badges = [];
        }
        // 保留其他位置的 badges，例如锁定和标签
        node.style.badges = node.style.badges.filter(({ position }) => position !== 'LB') || [];

        const expandIds = result.data.nodes.map(n => n.id);
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

  return (
    <div style={{ padding: 16 }}>
      <h4>请输入 Cypher 语句进行查询</h4>
      <CyperEditor onValueChange={getCyperInputValue} />
      <div style={{ textAlign: 'right' }}>
        <Button onClick={handleQuery} style={{ marginTop: 16 }}>
          执行查询
        </Button>
      </div>
    </div>
  );
};

export default CypherEditorPanel;
