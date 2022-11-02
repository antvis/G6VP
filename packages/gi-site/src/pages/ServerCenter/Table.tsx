import { Table } from 'antd';
import * as React from 'react';

const PackageTable = ({ data }) => {
  const containerRef = React.useRef<null | HTMLDivElement>(null);
  const [state, setState] = React.useState({
    visible: false,
    detail: '',
    serviceId: '',
  });
  const handleDelete = record => {
    location.reload();
  };

  const columns = [
    {
      title: 'API',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'method',
    },
    {
      title: '入参',
      dataIndex: 'req',
      key: 'req',
      render: record => {
        if (!record) {
          return '-';
        }
        return (
          <pre>
            <code>{record}</code>
          </pre>
        );
      },
    },
    {
      title: '出参: Promise<T>',
      dataIndex: 'res',
      key: 'res',
      render: record => {
        if (!record) {
          return '-';
        }
        return (
          <pre>
            <code>{record}</code>
          </pre>
        );
      },
    },
  ];
  const onClose = () => {
    setState({
      visible: false,
      detail: '',
      serviceId: '',
    });
  };
  const { visible } = state;
  console.log('state', state, data);
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
      ref={containerRef}
    >
      <Table dataSource={data} columns={columns}></Table>
    </div>
  );
};

export default PackageTable;
