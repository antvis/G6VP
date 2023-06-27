import React from 'react';
import { Drawer, Table } from 'antd';
import $i18n from '../../i18n';

interface AlgorithmResultProps {
  algorithmType: string;
  visible: boolean;
  close: () => void;
  data: any;
}
const columns = [
  {
    title: $i18n.get({ id: 'graphscope.components.ExecAlgorithmPanel.AlgorithmResultPanel.NodeId', dm: '节点ID' }),
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: $i18n.get({ id: 'graphscope.components.ExecAlgorithmPanel.AlgorithmResultPanel.Result', dm: '结果' }),
    dataIndex: 'value',
    key: 'value',
  },
];

const AlgorithmResultPanel: React.FC<AlgorithmResultProps> = ({ algorithmType, visible, close, data }) => {
  return (
    <Drawer
      visible={visible}
      width={800}
      title={$i18n.get(
        {
          id: 'graphscope.components.ExecAlgorithmPanel.AlgorithmResultPanel.AlgorithmtypeAlgorithmResultPanel',
          dm: '{algorithmType} 算法结果面板',
        },
        { algorithmType: algorithmType },
      )}
      onClose={close}
    >
      <Table columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
    </Drawer>
  );
};

export default AlgorithmResultPanel;
