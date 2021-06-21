import { CheckCard } from '@alipay/tech-ui';
import { RightOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Form, Input, notification, Row, Steps, Table, Tabs, Tooltip, Upload } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { defaultConfig } from './defaultConfig';
import { defaultData, defaultTrans } from './defaultData';
import { getUid } from './utils';

Lockr.prefix = 'gi_';

interface CreatePanelProps {
  history: any;
}

const { Step } = Steps;
const { TabPane } = Tabs;

const lists = [
  {
    id: 'GIConfig',
    title: '空白模版',
  },
  {
    id: 'knowledgeGraph',
    title: '知识图谱',
  },
  {
    id: 'riskControl',
    title: '风控',
  },
];

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

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const services = {
  getGraphDataTransform: `
  data => {
    return data
  }
  `,
  getSubGraphDataTransform: `(data,ids) => {
    return {nodes:[],edges:[]}
  }`,
};

const CreatePanel: React.FunctionComponent<CreatePanelProps> = props => {
  const [current, setCurrent] = React.useState(0);
  const [userConfig, setUserConfig] = React.useState({
    id: '',
    title: '',
    config: defaultConfig.GIConfig,
  });
  const [inputData, setInputData] = React.useState([
    {
      uid: '1',
      data: defaultData.GIConfig,
    },
  ]);
  const [transform, setTransform] = React.useState(defaultTrans.GIConfig);
  const [data, setData] = React.useState({ nodes: [], edges: [] });
  const dataRef = React.useRef(null);
  const transformRef = React.useRef(null);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const setDefaultConfig = id => {
    setUserConfig({
      ...userConfig,
      config: defaultConfig[id],
    });
    setInputData([
      {
        uid: '1',
        data: defaultData[id],
      },
    ]);
    setTransform(defaultTrans[id]);
  };

  const creatProgram = () => {
    const { history } = props;
    let id = getUid();
    const { config, ...others } = userConfig;

    Lockr.sadd('project', { ...others, id, time: new Date().toLocaleString() });

    Lockr.set(id, {
      data,
      ...userConfig,
      // id,
      /**
       * 临时方案
       * 数据标准化节点，需要在「上传数据」阶段就准备好
       * 数据过滤的阶段，需要在数据服务模块添加
       */
      services,
    });

    console.log(Lockr.get(id));
    history.push(`/workspace/${id}`);
  };

  const getUserInfo = value => {
    setUserConfig({
      ...userConfig,
      ...value,
    });
    next();
    runTransform();
  };

  const uploadProps = {
    name: 'file',
    defaultFileList: [
      {
        uid: '1',
        name: 'demo.json',
        status: 'done',
      },
    ],
    customRequest: options => {
      const { file, onSuccess } = options;
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = fileReader => {
        const fileData = fileReader.target.result;
        setInputData([
          ...inputData,
          {
            uid: file.uid,
            data: JSON.parse(fileData as string),
          },
        ]);
        onSuccess('Ok');
      };
    },
    onRemove: file => {
      const renderData = inputData.filter(d => d.uid !== file.uid);
      setInputData(renderData);
    },
  };

  const checkData = () => {
    const model = dataRef.current.editor.getModel();
    const value = model.getValue();

    try {
      let data = JSON.parse(value);
      if (data.nodes?.find(d => !d.id || !d.data)) {
        throw 'nodes缺少对应字段';
      }
      if (data.edges?.find(d => !d.source || !d.target || !d.data)) {
        throw 'edges缺少对应字段';
      }
      notification.success({
        message: `解析成功`,
        description: `数据格式正确`,
        placement: 'topLeft',
      });
      next();
    } catch (error) {
      notification.error({
        message: `解析出错`,
        description: `请检查数据是否为严格JSON格式且存在对应字段:${error}`,
        placement: 'topLeft',
      });
    }
  };

  const runTransform = () => {
    const model = transformRef.current.editor.getModel();
    const value = model.getValue();
    setTransform(value);
    let nodes = [];
    let edges = [];
    inputData.map(d => {
      nodes = [...nodes, ...d.data.nodes];
      edges = [...edges, ...d.data.edges];
    });

    setData(eval(value)({ nodes, edges }));
  };

  const nodeTableData = data?.nodes.map((d, i) => {
    return {
      ...d,
      key: i,
    };
  });
  const edgeTableData = data?.edges.map((d, i) => {
    return {
      ...d,
      key: i,
    };
  });
  const steps = [
    {
      title: 'First',
      content: (
        <Form {...layout} name="basic" onFinish={getUserInfo}>
          <Form.Item label="项目名称" name="title" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input value={userConfig.title} />
          </Form.Item>
          <Form.Item label="解决方案">
            <CheckCard.Group onChange={setDefaultConfig} defaultValue={lists[0].id}>
              {lists.map(item => {
                const { id, title } = item;
                return <CheckCard title={title} key={id} description="文本描述文本描述文本描述" value={id} />;
              })}
            </CheckCard.Group>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Second',
      content: (
        <>
          <Alert
            message="提示信息"
            description="输入数据格式为{ nodes: { id, data }[], edges: { source, target, data}[]}且上传文件暂只支持json"
            type="info"
          />
          <Row align="middle" style={{ padding: '10px 0px' }}>
            上传数据源
            <Tooltip title="上传数据源">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>select file</Button>
              </Upload>
            </Tooltip>
          </Row>
          <Row align="middle" justify="space-around">
            <Col span={11}>
              <MonacoEditor
                ref={transformRef}
                width="100%"
                height="70vh"
                language="javascript"
                theme="vs-dark"
                value={transform}
              />
            </Col>
            <Col span={1.5}>
              <Button type="primary" icon={<RightOutlined />} onClick={runTransform} />
            </Col>
            <Col span={11}>
              <MonacoEditor
                ref={dataRef}
                width="100%"
                height="70vh"
                language="json"
                theme="vs-dark"
                value={JSON.stringify(data, null, 2)}
              />
            </Col>
          </Row>
          <Row style={{ padding: '10px 0px' }}>
            <Button style={{ margin: '0 10px' }} onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" onClick={checkData}>
              下一步
            </Button>
          </Row>
        </>
      ),
    },
    {
      title: 'Last',
      content: (
        <>
          <Row>数据格式校验成功！</Row>
          <Row>
            <Tabs defaultActiveKey="node">
              <TabPane tab="nodes" key="node">
                <Table dataSource={nodeTableData} columns={nodeColumns} />
              </TabPane>
              <TabPane tab="edges" key="edge">
                <Table dataSource={edgeTableData} columns={edgeColumns} />
              </TabPane>
            </Tabs>
          </Row>
          <Row>
            <Button style={{ margin: '0 10px' }} onClick={() => prev()}>
              上一步
            </Button>
            <Button type="primary" onClick={creatProgram}>
              进入分析
            </Button>
          </Row>
        </>
      ),
    },
  ];
  return (
    <div>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action"></div>
    </div>
  );
};

export default CreatePanel;
