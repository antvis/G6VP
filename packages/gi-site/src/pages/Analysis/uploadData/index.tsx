import * as React from 'react';
import { Modal, Tabs, Steps, Alert, Row, Radio, Upload, Button, Table, Form, notification } from 'antd';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { EditableProTable } from '@ant-design/pro-table';
import store, { StateType } from '../redux';
import { updateProjectById } from '../../../services';
import { FileTextOutlined } from '@ant-design/icons';
import { useImmer } from 'use-immer';
import { nodeColumns, edgeColumns, translist, GIDefaultTrans, getOptions } from './const';
import './index.less';

const { Step } = Steps;
const { Dragger } = Upload;
interface uploadPanel {
  visible: boolean;
  initData: any;
  handleClose: () => void;
}

const { TabPane } = Tabs;

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
  const [transData, setTransData] = useImmer(eval(GIDefaultTrans('id', 'source', 'target'))(initData));
  const [tableData, setTableData] = useImmer([]);
  const [columns, setColumns] = useImmer(nodeColumns);
  const [transColumns, setTransColumns] = useImmer([]);
  const editableKeys = ['edit'];
  const [form] = Form.useForm();
  const [tableType, setTableType] = useImmer('nodes');
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
    const transFunc = GIDefaultTrans('id', 'scource', 'target');
    setData({ nodes, edges });
    setTransData(eval(transFunc)({ nodes, edges }));
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const checkData = () => {
    next();
    //获取上传数据字段
    setTransColumns(getOptions(data));
    //
    setTableData(
      transData?.nodes.map((d, i) => {
        return {
          ...d,
          key: i,
        };
      }),
    );
  };

  const onChange = value => {
    setTableData(
      transData?.[value].map((d, i) => {
        return {
          ...d,
          key: i,
        };
      }),
    );
    setColumns(columnsData[value]);
    setTableType(value);
  };

  const transform = recordList => {
    const { id, source, target } = recordList[0];
    const transFunc = GIDefaultTrans(id, source, target);
    const result = eval(transFunc)(data);
    setTransData(result);

    setTableData(
      result?.[tableType].map((d, i) => {
        return {
          ...d,
          key: i,
        };
      }),
    );
  };

  const updateData = () => {
    try {
      if (transData.nodes?.find(d => !d.id || !d.data)) {
        throw 'nodes缺少对应字段';
      }
      if (transData.edges?.find(d => !d.source || !d.target || !d.data)) {
        throw 'edges缺少对应字段';
      }
      notification.success({
        message: `解析成功`,
        description: `数据格式正确`,
        placement: 'topLeft',
      });

      updateProjectById(id, {
        data: JSON.stringify(transData),
      }).then(res => {
        dispatch({
          type: 'update:key',
          key: Math.random(),
        });
        handleClose();
      });
    } catch (error) {
      notification.error({
        message: `解析出错`,
        description: `请检查数据是否为严格JSON格式且存在对应字段:${error}`,
        placement: 'topLeft',
      });
    }
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
          <EditableProTable
            columns={transColumns}
            rowKey="key"
            recordCreatorProps={false}
            value={translist}
            editable={{
              form,
              type: 'multiple',
              editableKeys,
              onValuesChange: (record, recordList) => {
                transform(recordList);
              },
            }}
          />
          <div className="fliter-group">
            <span>数据预览</span>
            <Radio.Group onChange={e => onChange(e.target.value)} defaultValue={tableType}>
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
