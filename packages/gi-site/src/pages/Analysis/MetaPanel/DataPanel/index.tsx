import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Card, Collapse, Space } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';

const { Panel } = Collapse;
interface DataPanelProps {}

const Header = props => {
  const { title } = props;
  return (
    <Space>
      {title}
      <TableOutlined />
      <EyeOutlined />
      <EyeInvisibleOutlined />
      <DeleteOutlined />
    </Space>
  );
};

const ServiceHeader = props => {
  const { title } = props;
  return (
    <Space>
      {title}
      <TableOutlined />
      <EditOutlined />
      <DeleteOutlined />
    </Space>
  );
};

const DataPanel: React.FunctionComponent<DataPanelProps> = props => {
  const dispatch = useDispatch();

  const uploadData = () => {
    dispatch({
      type: 'update',
      isModalVisible: true,
    });
  };

  return (
    <div>
      <Card
        title="数据源"
        extra={
          <Button type="dashed" style={{ width: '100%' }} onClick={uploadData}>
            <UploadOutlined /> 导入数据
          </Button>
        }
      >
        <Collapse defaultActiveKey={['1']}>
          <Panel header={<Header title="dount.json" />} key="1">
            Nodes:10 Edges:20
          </Panel>
          <Panel header={<Header title="graph.json" />} key="2">
            Nodes:20 Edges:40
          </Panel>
        </Collapse>
      </Card>
      <Card
        title="数据服务"
        extra={
          <Button
            type="dashed"
            style={{ width: '100%' }}
            onClick={() => {
              // window.open(`#/market/services/${projectId}`);
              window.open(`#/market/services`);
            }}
          >
            <PlusOutlined />
            新建服务
          </Button>
        }
      >
        <Collapse>
          <Panel header={<ServiceHeader title="GI_INIT_SERVICE" />} key="1"></Panel>
        </Collapse>
      </Card>
      <Card title="网络分析"></Card>
    </div>
  );
};

export default DataPanel;
