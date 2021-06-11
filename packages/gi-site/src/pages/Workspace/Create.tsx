import { 
  Button,
  Steps,
  Radio,
  Row,
  Col,
  Card,
  Tooltip,
  Upload,
  Table,
  Tabs,
  Form,
  Input
} from 'antd';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { UploadOutlined } from '@ant-design/icons';
import Lockr from 'lockr';
import { getUid } from './utils';
import { defaultConfig } from './defaultConfig';

interface CreatePanelProps {}

const { Step } = Steps;
const { Meta } = Card;
const { TabPane } = Tabs;

const lists = [
  {
    id: 'GIConfig',
    title: '空白模版'
  },
  {
    id: 'knowledgeGraph',
    title: '知识图谱'
  },
  {
    id: 'riskControl',
    title: '风控'
  }
]

const nodeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  }
]

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
  }
]

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CreatePanel: React.FunctionComponent<CreatePanelProps> = props => {
  const [current, setCurrent] = React.useState(0);
  const [userConfig, setUserConfig] = React.useState({
    id:"",
    title:"",
    config:{}
  });
  const [viewMode, setViewMode] = React.useState('code');
  const [data, setData] = React.useState({ nodes: [], edges: [] });

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const setDefaultConfig = (id) => {
    setUserConfig({
      ...userConfig,
      config: defaultConfig[id]
    })
    next();
  };

  const handleViewChange = e => {
    setViewMode(e.target.value);
  }

  const transform = (data) => {
    return data;
  }

  const creatProgram = () => {
    let id = getUid();
    debugger
    const {config,...others } = userConfig;
    Lockr.sadd('project', {...others, id});
    Lockr.set(id, { 
      data:transform(data),
      ...userConfig,
      /** 
       * 临时方案
       * 数据标准化节点，需要在「上传数据」阶段就准备好
       * 数据过滤的阶段，需要在数据服务模块添加
       */
      service:{
        transform:`
          function(data){
 
            const nodes = data.nodes.map(n=>{
              return {
                id:n.id,
                data:n
              }
            })
            const edges = data.edges.map(e=>{
              return {
                source:e.source,
                target:e.target,
                data:e
              }
            })
            return {nodes,edges}
          }
        `
      }
    } );
   
    
  }

  const getUserInfo = (value) => {
    setUserConfig({
      ...userConfig,
      ...value
    });
    next();
  }

  const uploadProps = {
    name: 'file',
    customRequest: options => {
      const { file, onSuccess } = options;
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = fileReader => {
        const fileData = fileReader.target.result;
        setData(JSON.parse(fileData as string));
        onSuccess("Ok");
      }
    }
  };

  const steps = [
    {
      title: 'First',
      content: (
      <Form
        {...layout}
        name="basic"
        onFinish={getUserInfo}
      >
        <Form.Item
          label="项目名称"
          name="title"
          rules={[{ required: true, message: 'Please input project title!' }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </Form.Item>
      </Form>)
    },
    {
      title: 'Second',
      content: (
        <Row gutter={16}>
            {lists.map(item => {
              const { id, title } = item;
              return (
                <Col key={id} span={6}>
                  <Card
                    style={{ width: '100%' }}
                    hoverable
                    onClick={() => setDefaultConfig(id)}
                  >
                  <Meta title={title} description="文本描述文本描述文本描述文本描述" />
                </Card>
              </Col>
            );
          })}
        </Row>),
    },
    {
      title: 'Last',
      content: (
        <>
        <Row gutter={16}>
          数据源    
          <Tooltip title="上传数据源">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>select file</Button>
            </Upload>
          </Tooltip>
        </Row>
        <Row gutter={16}>
          <Radio.Group value={viewMode} onChange={handleViewChange}>
            <Radio.Button value="table">表格视图</Radio.Button>
            <Radio.Button value="code">代码视图</Radio.Button>
          </Radio.Group>
        </Row>
        <Row gutter={16}>
          {viewMode === 'code' && (      
          <MonacoEditor
            width="100%"
            height="80vh"
            language="json"
            theme="vs-dark"
            value={JSON.stringify(data, null, 2)}
          />)}
          {viewMode === 'table' && (
            <Tabs defaultActiveKey="node">
            <TabPane tab="Tab 1" key="node">
              <Table dataSource={data?.nodes} columns={nodeColumns} />
            </TabPane>
            <TabPane tab="Tab 2" key="edge">
              <Table dataSource={data?.edges} columns={edgeColumns} />
            </TabPane>
          </Tabs>)}
        </Row>
        </>
      ),
    }
  ];
  return (
    <div>
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current === steps.length - 1 && (
          <Button type="primary" onClick={creatProgram}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatePanel;
