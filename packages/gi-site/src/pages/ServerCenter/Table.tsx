import { Button, Drawer, Table } from 'antd';
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
      key: 'type',
    },
    {
      title: '入参',
      dataIndex: 'req',
      key: 'req',
    },
    {
      title: '出参',
      dataIndex: 'res',
      key: 'res',
    },
    {
      title: '操作',
      render: record => {
        return (
          <Button
            onClick={() => {
              setState(preState => {
                return {
                  ...preState,
                  visible: true,
                  detail: record.detail,
                  serviceId: `${record.id} ：${record.name} `,
                };
              });
            }}
          >
            查看详情
          </Button>
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
      <Drawer
        title={state.serviceId}
        placement="left"
        getContainer={false}
        // getContainer={containerRef.current as HTMLDivElement}
        closable={false}
        onClose={onClose}
        visible={visible}
        width="50%"
        // mask={false}
        maskStyle={{
          background: 'transparent',
        }}
        style={{ position: 'absolute' }}
      >
        <code>
          <pre>{state.detail}</pre>
        </code>
      </Drawer>
    </div>
  );
};

export default PackageTable;
