import React from 'react';
import { Drawer, Table } from 'antd';

interface AlgorithmResultProps {
  algorithmType: string;
  visible: boolean;
  close: () => void;
  data: any;
}
const columns = [
  {
    title: '节点ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '结果',
    dataIndex: 'value',
    key: 'value',
  },
];
const AlgorithmResultPanel: React.FC<AlgorithmResultProps> = ({ algorithmType, visible, close, data }) => {
  return (
    <Drawer visible={visible} width={800} title={`${algorithmType} 算法结果面板`} onClose={close}>
      <Table columns={columns} dataSource={data} pagination={{ hideOnSinglePage: true }} />
    </Drawer>
  );
};

export default AlgorithmResultPanel;
