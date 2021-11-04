import * as React from 'react';
import { Modal, Tabs, Steps, Alert, Row, Radio, Upload, Button, Table } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import './index.less';

const { Step } = Steps;
const { Dragger } = Upload;
interface uploadPanel {
  visible: boolean;
  handleClose: () => void;
}

const { TabPane } = Tabs;
const nodeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'data',
    dataIndex: 'data',
    key: 'data',
    render: data => <span>{JSON.stringify(data)}</span>,
  },
];

const edgeColumns = [
  {
    title: 'source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'target',
    dataIndex: 'target',
    key: 'target',
  },
  {
    title: 'data',
    dataIndex: 'data',
    key: 'data',
    render: data => <span>{JSON.stringify(data)}</span>,
  },
];

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const draggerProps = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      // message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
const UploadPanel: React.FunctionComponent<uploadPanel> = props => {
  const { visible, handleClose } = props;
  const [current, setCurrent] = React.useState(0);
  const [data, setData] = React.useState({ nodes: [], edges: [] });
  const [tableData, setTableData] = React.useState([]);
  const [columns, setColumns] = React.useState(nodeColumns);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const checkData = () => {
    next();
  };

  const onChange = e => {
    const value = e.target.value;
    setTableData(
      data?.[value].map((d, i) => {
        return {
          ...d,
          key: i,
        };
      }),
    );
    setColumns(columnsData[value]);
  };

  const creatProgram = () => {};

  const steps = [
    {
      title: '上传数据',
      content: (
        <div className="upload-panel">
          <Alert
            message=""
            description="输入数据格式为{ nodes: { id, data }[], edges: { source, target, data}[]}且上传文件暂只支持json"
            type="info"
            style={{ margin: '10px 0px' }}
          />
          <div className="upload-panel-section">
            <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <FileTextOutlined />
              </p>
              <p>点击或将数据文件拖拽到这里上传</p>
            </Dragger>
          </div>
          <Row style={{ padding: '30px 0px 10px 0px', justifyContent: 'center' }}>
            <Button type="primary" shape="round" onClick={checkData}>
              进入下一步
            </Button>
          </Row>
        </div>
      ),
    },
    {
      title: '数据格式校验',
      content: (
        <div className="dataCheck-panel">
          <div className="fliter-group">
            <span>数据预览</span>
            <Radio.Group onChange={onChange} defaultValue="node">
              <Radio.Button value="nodes">Node</Radio.Button>
              <Radio.Button value="edges">Edge</Radio.Button>
            </Radio.Group>
          </div>
          <Table dataSource={tableData} columns={columns} />
          <Row>
            <Button style={{ margin: '0 10px' }} onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" onClick={creatProgram}>
              进入分析
            </Button>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <Modal title="导入数据" visible={visible} width={846} footer={null} onCancel={handleClose}>
      <Tabs defaultActiveKey="document">
        <TabPane tab="文件" key="document">
          <Steps current={current} type="navigation">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <div className="steps-action"></div>
        </TabPane>
        <TabPane tab="OpenAPI" key="OpenAPI" disabled></TabPane>
      </Tabs>
    </Modal>
  );
};

export default UploadPanel;
