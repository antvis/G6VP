import { Alert, Button, Form, notification, Radio, Row, Steps, Table, Upload } from 'antd';
import * as React from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';
import { useImmer } from 'use-immer';
import { edgeColumns, nodeColumns, translist } from './const';
import { getOptions, GIDefaultTrans } from './utils';
import xlsx2js from 'xlsx2js';
import { updateData } from './service';
import { ServerComponentProps, IInputData, ITableType, IColumns } from './type';
import './index.less';
import { GraphinData, IUserEdge, IUserNode } from '@antv/graphin';

const { Step } = Steps;
const { Dragger } = Upload;

const columnsData = {
  nodes: nodeColumns,
  edges: edgeColumns,
};

const ServerComponent: React.FC<ServerComponentProps> = props => {
  const { handleClose, initData } = props;

  const [current, setCurrent] = useImmer({
    activeKey: 0,
    buttonDisabled: true,
  });

  const [inputData, setInputData] = useImmer<IInputData[]>([]);
  //初始化数据
  const [data, setData] = useImmer<GraphinData>(initData);
  // 映射函数
  const [transfunc, setTransfunc] = useImmer<string>(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'));
  //映射后的数据
  const [transData, setTransData] = useImmer<GraphinData>(
    eval(GIDefaultTrans('id', 'source', 'target', 'nodeType', 'edgeType'))(initData),
  );
  //当前显示
  const [tableData, setTableData] = useImmer<object[]>([]);
  const [columns, setColumns] = useImmer<IColumns[]>(nodeColumns);
  const [transColumns, setTransColumns] = useImmer<object[]>([]);
  const editableKeys = ['edit'];
  const [form] = Form.useForm();
  const [tableType, setTableType] = useImmer<ITableType>('nodes');

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

        console.log('data:', data);

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

        const renderData: IInputData[] = [
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
          fileData = JSON.parse(fileReader.target!.result as string);

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

  const mergeData = (renderData: IInputData[] = inputData) => {
    let nodes: IUserNode[] = [];
    let edges: IUserEdge[] = [];
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
            <Button type="primary" shape="round" onClick={() => updateData(transData, inputData, transfunc)}>
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

export default ServerComponent;
