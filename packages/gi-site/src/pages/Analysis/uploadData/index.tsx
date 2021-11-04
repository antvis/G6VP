import * as React from 'react';
import { Modal, Tabs, Steps, Alert, Row, Radio, Upload, Button, Table } from 'antd';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store, { StateType } from '../redux';
import { updateProjectById } from '../../../services';
import { FileTextOutlined } from '@ant-design/icons';
import { useImmer } from 'use-immer';
import './index.less';

const { Step } = Steps;
const { Dragger } = Upload;
interface uploadPanel {
  visible: boolean;
  initData: any;
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

const UploadPanel: React.FunctionComponent<uploadPanel> = props => {
  const { visible, handleClose, initData } = props;
  const state = useSelector((state: StateType) => state);
  const { id } = state;
  const [current, setCurrent] = useImmer(0);
  const dispatch = useDispatch();
  const [data, setData] = useImmer(initData);
  const [tableData, setTableData] = useImmer([]);
  const [columns, setColumns] = useImmer(nodeColumns);

  const [inputData, setInputData] = useImmer([
    {
      uid: '1',
      name: 'demo.js',
      data: initData,
    },
  ]);
  const draggerProps = {
    name: 'file',
    defaultFileList: inputData,
    onRemove: file => {
      const renderData = inputData.filter(d => d.uid !== file.uid);
      setInputData(renderData);
      mergeData(renderData);
    },
    customRequest: options => {
      const { file, onSuccess } = options;
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = fileReader => {
        const fileData = fileReader.target.result;
        const renderData = [
          ...inputData,
          {
            uid: file.uid,
            name: file.name,
            data: JSON.parse(fileData as string),
          },
        ];
        setInputData(renderData);
        onSuccess('Ok');
        mergeData(renderData);
      };
    },
  };

  const mergeData = (renderData = inputData) => {
    let nodes = [];
    let edges = [];
    renderData.map(d => {
      nodes = [...nodes, ...d.data.nodes];
      edges = [...edges, ...d.data.edges];
    });
    setData({ nodes, edges });
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const checkData = () => {
    next();
    setTableData(
      data?.nodes.map((d, i) => {
        return {
          ...d,
          key: i,
        };
      }),
    );
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

  const updateData = () => {
    updateProjectById(id, {
      data: JSON.stringify(data),
    }).then(res => {
      dispatch({
        type: 'update:key',
        key: Math.random(),
      });
      handleClose();
    });
  };

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
      title: '配置字段',
      content: (
        <div className="dataCheck-panel">
          <div className="fliter-group">
            <span>数据预览</span>
            <Radio.Group onChange={onChange} defaultValue="nodes">
              <Radio.Button value="nodes">Node</Radio.Button>
              <Radio.Button value="edges">Edge</Radio.Button>
            </Radio.Group>
          </div>
          <Table dataSource={tableData} columns={columns} />
          <Row style={{ justifyContent: 'center' }}>
            <Button style={{ margin: '0 10px' }} shape="round" onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" shape="round" onClick={updateData}>
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

const WrapUploadPanel = props => {
  return (
    <Provider store={store}>
      <UploadPanel {...props} />
    </Provider>
  );
};

export default WrapUploadPanel;
