import { CheckCard } from '@alipay/tech-ui';
import { AlipayCircleOutlined, AntCloudOutlined, SlackSquareOutlined, TaobaoCircleOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';
import { Alert, Button, Col, Form, notification, Radio, Row, Steps, Table } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import antiMoneyData from '../../../mock/AML/v1.2.json';
import cloudSecurityData from '../../../mock/cloud-security.json';
import transportData from '../../../mock/linkrous/transport.json';
import enterpriseData from '../../../mock/path-analysis/shareholding-path.json';
import { getProjectById, updateProjectById } from '../../../services';
import { useContext } from '../../Analysis/hooks/useContext';
import { generatorSchemaByGraphData, generatorStyleConfigBySchema } from '../utils';
import { edgeColumns, getOptions, GIDefaultTrans, nodeColumns, translist } from './const';
import './index.less';

const MockData = {
  // 企业持股
  enterprise: enterpriseData,
  // 云安全
  cloudSecurity: cloudSecurityData,
  // 反洗钱
  antiMoney: antiMoneyData,
  // 巴黎地铁图
  transport: transportData,
};

const { Step } = Steps;
interface uploadPanel {
  handleClose: () => void;
}

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const UploadPanel: React.FunctionComponent<uploadPanel> = props => {
  const { handleClose } = props;
  const { context, updateContext } = useContext();

  const { id } = context;
  const [current, setCurrent] = useImmer({
    activeKey: 0,
  });

  //初始化数据
  const [data, setData] = useImmer({});
  // 映射函数
  const [transfunc, setTransfunc] = useImmer(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'));
  //映射后的数据
  const [transData, setTransData] = useImmer(
    eval(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'))({ nodes: [], edges: [] }),
  );
  //当前显示
  const [tableData, setTableData] = useImmer([]);
  const [columns, setColumns] = useImmer(nodeColumns);
  const [transColumns, setTransColumns] = useImmer([]);
  const editableKeys = ['edit'];
  const [form] = Form.useForm();
  const [tableType, setTableType] = useImmer('nodes');
  const [inputData, setInputData] = useImmer([]);

  const mergeData = (renderData = inputData) => {
    let nodes = [];
    let edges = [];
    renderData.map(d => {
      nodes = [...nodes, ...d.data.nodes];
      edges = [...edges, ...d.data.edges];
    });
    setData({ nodes, edges });
    setTransData(eval(transfunc)({ nodes, edges }));
  };

  const next = () => {
    setCurrent(draft => {
      draft.activeKey++;
    });
  };

  const prev = () => {
    setCurrent(draft => {
      draft.activeKey--;
    });
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
    const { id, source, target, nodeType, edgeType } = recordList[0];
    const transFunc = GIDefaultTrans(id, source, target, nodeType, edgeType);

    setTransfunc(transFunc);

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

  const updateData = async () => {
    try {
      if (transData.nodes?.find(d => d.id === undefined || d.data === undefined)) {
        throw 'nodes缺少对应字段';
      }
      if (transData.edges?.find(d => d.source === undefined || d.target === undefined || d.data === undefined)) {
        throw 'edges缺少对应字段';
      }

      const result = await getProjectById(id);

      const beforData = result.data.transData;
      const mergeData = {
        nodes: [...beforData.nodes, ...transData.nodes],
        edges: [...beforData.edges, ...transData.edges],
      };

      // 进入分析之前，根据数据，生成 schema
      const schemaData = generatorSchemaByGraphData(mergeData);
      const newConfig = generatorStyleConfigBySchema(schemaData, context.config);
      console.log('生成的 Schema 数据', schemaData);

      // 更新inputdata里面的 trans function
      const renderData = inputData.map(d => {
        return {
          ...d,
          transfunc,
        };
      });

      updateProjectById(id, {
        data: JSON.stringify({
          transData: mergeData,
          inputData: [...result.data.inputData, ...renderData],
        }),
        // schemaData: schemaData,
        projectConfig: JSON.stringify(newConfig),
        schemaData: JSON.stringify(schemaData),
      }).then(res => {
        updateContext(draft => {
          draft.key = Math.random();
          draft.schemaData = schemaData;
          // draft.config = newConfig;
        });
        handleClose();
      });

      notification.success({
        message: `解析成功`,
        description: `数据格式正确`,
        placement: 'topLeft',
      });
    } catch (error) {
      notification.error({
        message: `解析出错`,
        description: `请检查数据是否为严格JSON格式且存在对应字段:${error}`,
        placement: 'topLeft',
      });
    }
  };

  const handleMockDataChange = value => {
    console.log('value', value);
    const renderData = [
      // ...inputData,
      {
        uid: value,
        name: value,
        data: MockData[value],
        transfunc,
        enable: true,
      },
    ];
    setInputData(renderData);
    mergeData(renderData);
  };

  const steps = [
    {
      title: '选择数据',
      content: (
        <div style={{ margin: '10px 0px 0px 0px' }}>
          <Row style={{ paddingTop: 16 }}>
            <Col span={24}>
              <CheckCard.Group onChange={handleMockDataChange} defaultValue="">
                <CheckCard
                  title="企业持股数据"
                  description="企业持股测试数据，通过探索可以发现各个公司的持股情况"
                  value="enterprise"
                  avatar={<TaobaoCircleOutlined style={{ fontSize: 35 }} />}
                />
                <CheckCard
                  title="反洗钱数据"
                  description="反洗钱测试数据，可以通过探索分析可以发现存在的洗钱风险"
                  value="antiMoney"
                  avatar={<AlipayCircleOutlined style={{ fontSize: 35 }} />}
                />
                <CheckCard
                  title="巴黎地铁图"
                  description="巴黎地铁图数据，通过图分析结合地理信息，可以直观地发现地铁图的分布"
                  value="transport"
                  avatar={<SlackSquareOutlined style={{ fontSize: 35 }} />}
                />
                <CheckCard
                  title="云安全数据"
                  description="云安全测试数据，通过测试数据探索云安全分析场景"
                  value="cloudSecurity"
                  avatar={<AntCloudOutlined style={{ fontSize: 35 }} />}
                />
              </CheckCard.Group>
            </Col>
          </Row>
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
          <Alert
            message="请从数据中选择合适的字段：NodeID,Source,Target 为图数据结构的必填字段。NodeType,EdgeType 为可选字段，用于生成图的 Schema"
            type="info"
            showIcon
            style={{ margin: '12px 0px' }}
          />
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
            <span className="title">数据预览</span>
            <Radio.Group onChange={e => onChange(e.target.value)} defaultValue={tableType}>
              <Radio.Button value="nodes">Node</Radio.Button>
              <Radio.Button value="edges">Edge</Radio.Button>
            </Radio.Group>
          </div>
          <Table dataSource={tableData} columns={columns} scroll={{ y: 240, x: 1300 }} />
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
    <>
      <Steps current={current.activeKey} type="navigation">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current.activeKey].content}</div>
      <div className="steps-action"></div>
    </>
  );
};

export default UploadPanel;
