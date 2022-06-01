import { FileTextOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';
import { Alert, Button, Drawer, Form, notification, Radio, Row, Steps, Table, Tabs, Upload } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';
import xlsx2js from 'xlsx2js';
import { getProjectById, updateProjectById } from '../../../services';
import { useContext } from '../../Analysis/hooks/useContext';
import { generatorSchemaByGraphData, generatorStyleConfigBySchema } from '../utils';
import { edgeColumns, getOptions, GIDefaultTrans, nodeColumns, translist } from './const';
import GraphScopeData from './GraphScopeData';
import MockData from './MockData';
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
  const { context, updateContext } = useContext();

  const { id } = context;
  const [current, setCurrent] = useImmer({
    activeKey: 0,
    buttonDisabled: true,
  });

  //初始化数据
  const [data, setData] = useImmer(initData);
  // 映射函数
  const [transfunc, setTransfunc] = useImmer(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'));
  //映射后的数据
  const [transData, setTransData] = useImmer(
    eval(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'))(initData),
  );
  //当前显示
  const [tableData, setTableData] = useImmer([]);
  const [columns, setColumns] = useImmer(nodeColumns);
  const [transColumns, setTransColumns] = useImmer([]);
  const editableKeys = ['edit'];
  const [form] = Form.useForm();
  const [tableType, setTableType] = useImmer('nodes');
  const [inputData, setInputData] = useImmer([]);
  const draggerProps = {
    name: 'file',
    defaultFileList: inputData,
    onRemove: file => {
      const renderData = inputData.filter(d => d.uid !== file.uid);
      if (renderData.length === 0) {
        setCurrent(draft => {
          draft.buttonDisabled = true;
        });
      }
      setInputData(renderData);
      mergeData(renderData);
    },
    customRequest: async options => {
      const { file, onSuccess } = options;
      let fileData;

      setCurrent(draft => {
        draft.buttonDisabled = false;
      });

      if (!file) {
        return false;
      } else if (/\.(xls|xlsx|csv)$/.test(file.name.toLowerCase())) {
        const data = await xlsx2js(file);

        const firstData = data[0];
        const isEdge = firstData.source && firstData.target;
        fileData = isEdge
          ? {
              nodes: [],
              edges: data,
            }
          : {
              nodes: data,
              edges: [],
            };

        const renderData = [
          ...inputData,
          {
            uid: file.uid,
            name: file.name,
            data: fileData,
            transfunc,
            enable: true,
          },
        ];
        setInputData(renderData);
        onSuccess('Ok');
        mergeData(renderData);
      } else if (/\.(json)$/.test(file.name.toLowerCase())) {
        const reader = new FileReader();

        reader.readAsText(file, 'utf-8');

        reader.onload = fileReader => {
          fileData = JSON.parse(fileReader.target.result as string);

          const renderData = [
            ...inputData,
            {
              uid: file.uid,
              name: file.name,
              data: fileData,
              transfunc,
              enable: true,
            },
          ];
          setInputData(renderData);
          onSuccess('Ok');
          mergeData(renderData);
        };
      } else {
        return false;
      }
    },
  };

  const mergeData = (renderData = inputData) => {
    console.log('mergeData', renderData, inputData);
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

  const steps = [
    {
      title: '上传数据',
      content: (
        <div className="upload-panel" style={{ margin: '10px 0px 0px 0px' }}>
          <Alert
            message="如果暂时没有数据，可以切换上方导航栏到「示例数据」进行体验"
            type="info"
            showIcon
            closable
            style={{ marginBottom: '12px' }}
          />
          <h4 style={{ marginBottom: 0 }}>已传数据</h4>

          <div className="upload-panel-section">
            <Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <FileTextOutlined />
              </p>
              <p>点击或将数据文件拖拽到这里上传，支持 JSON，CSV，XLS，XLSX格式</p>
              <p>CSV/XLS/XLSX文件规范：</p>
              <p>分别上传点表和边表，点表：必须要有 id 字段，边表：必须要有 source 和 target 字段</p>
              <p>JSON 文件规范：</p>
              <p>点表和边表放在同一个 JSON 文件中上传，nodes 表示点的集合，edges 表示边的集合，其属性字段的规范同上</p>
            </Dragger>
          </div>
          <Row style={{ padding: '30px 0px 10px 0px', justifyContent: 'center' }}>
            <Button type="primary" disabled={current.buttonDisabled} shape="round" onClick={checkData}>
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
    <Drawer title="导入数据" visible={visible} width={'calc(100vw - 382px)'} onClose={handleClose}>
      <Tabs defaultActiveKey="document">
        <TabPane tab="本地文件" key="document">
          <Steps current={current.activeKey} type="navigation">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current.activeKey].content}</div>
          <div className="steps-action"></div>
        </TabPane>
        <TabPane tab="示例数据" key="mockdata">
          <MockData handleClose={handleClose} />
        </TabPane>

        <TabPane tab="GraphScope" key="graphscope">
          <Alert
            message="该功能目前仅支持阿里集团，蚂蚁集团 域内同学使用，预计8月将开放所有用户使用"
            type="info"
            showIcon
            style={{ marginBottom: '12px' }}
          />
          <GraphScopeData close={handleClose} />
        </TabPane>
        <TabPane tab="OpenAPI" key="OpenAPI" disabled></TabPane>
      </Tabs>
    </Drawer>
  );
};

export default UploadPanel;
