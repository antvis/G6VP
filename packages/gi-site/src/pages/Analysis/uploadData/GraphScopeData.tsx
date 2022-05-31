import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Switch,
  Table,
  Upload,
} from 'antd';
import React, { useState } from 'react';
import {
  closeGraphInstance,
  createGraphScopeInstance,
  loadChinaVisGraphToGraphScope,
  loadDefaultGraphToGraphScope,
  loadGraphToGraphScope,
  uploadLocalFileToGraphScope,
  queryGraphSchema,
} from '../../../services/graphcompute';
import { updateProjectById } from '../../../services';
import {
  ChinaVisEdgeColumns,
  ChinaVisEdgeData,
  ChinaVisNodeColumns,
  ChinaVisNodeData,
  DefaultGraphScopeEdgeFilePath,
  DefaultGraphScopeNodeFilePath,
  LoadChinaVisDataSource,
} from './const';
import { useContext } from '../hooks/useContext';
const { Item } = Form;
const { confirm } = Modal;

interface GraphModelProps {
  close: () => void;
}
const GraphScopeMode: React.FC<GraphModelProps> = ({ close }) => {
  const [form] = Form.useForm();
  const { updateContext, context } = useContext();

  const { id } = context;

  const graphScopeInstanceId = localStorage.getItem('graphScopeInstanceId');
  const graphScopeGraphName = localStorage.getItem('graphScopeGraphName');
  const graphScopeFilesMapping = JSON.parse(localStorage.getItem('graphScopeFilesMapping'));

  const [dataType, setDataType] = useState('real');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [filesMapping, setFilesMapping] = useState(graphScopeFilesMapping);

  const handleDataTypeChange = e => {
    setDataType(e.target.value);
  };

  /**
   * 实例化GraphScope引擎实例
   */
  const initGraphScopeInstance = async () => {
    let currentInstanceId = graphScopeInstanceId;
    // 不存在 GraphScope 实例，则进行创建
    if (!graphScopeInstanceId) {
      // step1: 初始化 GraphScope 引擎
      const gsResult = await createGraphScopeInstance();

      if (!gsResult || !gsResult.success) {
        message.error(`创建 GraphScope 引擎实例失败: ${gsResult.message}`);
        return null;
      }

      const { data } = gsResult;
      const { instanceId } = data;
      // 将 instanceId 存储到 localstorage 中
      localStorage.setItem('graphScopeInstanceId', instanceId);

      currentInstanceId = instanceId;
    }

    return currentInstanceId;
  };

  const confirmUploadFiles = () => {
    if (filesMapping) {
      confirm({
        title: '是否忽略已上传文件?',
        icon: <ExclamationCircleOutlined />,
        content:
          '你已经有上传的文件，是否选择忽略已经上传的文件，，如果选择「忽略已上传文件」，则已经上传的文件不会再次上传，如果选择全量覆盖，若上传同名文件，会覆盖之前上传的文件',
        onOk() {
          // 忽略已上传文件
          handleUploadFiles(false);
        },
        onCancel() {
          // 全量覆盖
          handleUploadFiles(true);
        },
        okText: '忽略已上传文件',
        cancelText: '全量覆盖',
      });
    } else {
      // 上传
      handleUploadFiles(true);
    }
  };

  const handleUploadFiles = async (isCover = false) => {
    setUploadLoading(true);
    const currentInstanceId = await initGraphScopeInstance();
    const values = await form.validateFields();

    // 如果 isCover = false， 则需要先过滤掉 nodeConfigList, edgeConfigList 中已经存在于 localstorage 中的文件
    const { nodeConfigList, edgeConfigList = [] } = values;

    const nodeFileLists = nodeConfigList
      .filter(d => d.nodeFileList && d.nodeType)
      .filter(d => {
        // 过滤到不完整的配置后，还要再过滤掉已经上传过的文件
        if (!isCover && graphScopeFilesMapping) {
          const fileName = d.nodeFileList.file.name;
          return !graphScopeFilesMapping[fileName];
        }
        return true;
      })
      .map(d => d.nodeFileList);
    const nodeFilePromise = nodeFileLists.map(d => {
      // 上传点文件
      const nodeFileResult = uploadLocalFileToGraphScope({
        fileList: d,
        instanceId: currentInstanceId,
      });
      return nodeFileResult;
    });

    const edgeFileLists = edgeConfigList
      .filter(d => d.edgeType && d.edgeFileList && d.sourceNodeType && d.targetNodeType)
      .filter(d => {
        // 过滤到不完整的配置后，还要再过滤掉已经上传过的文件
        if (!isCover && graphScopeFilesMapping) {
          const fileName = d.edgeFileList.file.name;
          return !graphScopeFilesMapping[fileName];
        }
        return true;
      })
      .map(d => d.edgeFileList);
    const edgeFilePromise = edgeFileLists.map(d => {
      // 上传点文件
      const edgeFileResult = uploadLocalFileToGraphScope({
        fileList: d,
        instanceId: currentInstanceId,
      });
      return edgeFileResult;
    });

    const filesUploadResult = await Promise.all([...nodeFilePromise, ...edgeFilePromise]);

    setUploadLoading(false);
    // 所有文件上传成功后，开始载图
    // 验证是否有上传失败的
    const failedFile = filesUploadResult.find(d => !d.success);
    if (failedFile) {
      // 有文件上传失败，提示用户，停止后面的逻辑
      message.error('文件上传失败');
      return;
    }

    // 构建 fileName: filePath 的对象
    const filePathMapping = {};
    filesUploadResult.forEach(d => {
      const { fileName, filePath } = d.data;
      filePathMapping[fileName] = filePath;
    });

    console.log('上传的文件对象', filePathMapping);
    const allUploadFiles = {
      ...filesMapping,
      ...filePathMapping,
    };
    setFilesMapping(allUploadFiles);

    localStorage.setItem('graphScopeFilesMapping', JSON.stringify(allUploadFiles));
    message.success('文件上传成功，可以点击进入分析开始载图并分析');
  };

  const updateSchemaData = async () => {
    // 载图成功后，更新 Project 中的 SchemeData
    // 查询 GraphScope 中的 Schema
    const result = await queryGraphSchema();

    if (result && result.success) {
      updateProjectById(id, {
        schemaData: JSON.stringify(result.data),
      }).then(() => {
        updateContext(draft => {
          draft.key = Math.random();
        });
      });
    }
  };

  const handleSubmitForm = async () => {
    setLoading(true);
    const currentInstanceId = await initGraphScopeInstance();

    // 使用示例数据
    if (dataType === 'demo') {
      const loadResult = await loadDefaultGraphToGraphScope({
        instanceId: currentInstanceId,
        nodeFilePath: DefaultGraphScopeNodeFilePath,
        nodeType: 'v0',
        edgeType: 'e0',
        sourceNodeType: 'v0',
        targetNodeType: 'v0',
        edgeFilePath: DefaultGraphScopeEdgeFilePath,
        directed: true,
        delimiter: ',',
        hasHeaderRow: true,
      });

      setLoading(false);
      console.log('加载数据到 GraphScope', loadResult);
      // 每次载图以后，获取最新 Gremlin server
      const { success: loadSuccess, message: loadMessage, data } = loadResult;
      if (!loadSuccess) {
        message.error(`数据加载失败: ${loadMessage}`);
        return;
      }
      message.success('加载数据到 GraphScope 引擎成功');
      const { graphName, graphURL } = data;
      localStorage.setItem('graphScopeGraphName', graphName);
      localStorage.setItem('graphScopeGremlinServer', graphURL);

      // 载图成功后，更新 Project 中的 SchemeData
      updateSchemaData();
      // 关闭弹框
      close();
      return;
    }

    // 载图 ChinaVis 数据
    if (dataType === 'chinavis') {
      // loadChinaVisGraphToGraphScope
      const loadResult = await loadChinaVisGraphToGraphScope({
        instanceId: currentInstanceId,
        dataSource: LoadChinaVisDataSource,
      });

      setLoading(false);
      console.log('加载数据到 GraphScope', loadResult);
      // 每次载图以后，获取最新 Gremlin server
      const { success: loadSuccess, message: loadMessage, data } = loadResult;
      if (!loadSuccess) {
        message.error(`数据加载失败: ${loadMessage}`);
        return;
      }
      message.success('加载数据到 GraphScope 引擎成功');
      const { graphName, graphURL } = data;
      localStorage.setItem('graphScopeGraphName', graphName);
      localStorage.setItem('graphScopeGremlinServer', graphURL);

      // 载图成功后，更新 Project 中的 SchemeData
      updateSchemaData();
      // 关闭弹框
      close();
      return;
    }

    // 没有上传文件
    if (!filesMapping) {
      message.error('请先上传文件后再进行载图');
      return;
    }

    const values = await form.validateFields();

    const {
      nodeConfigList,
      edgeConfigList = [],
      directed = true,
      delimiter = ',',
      hasHeaderRow = true,
      isStringType,
    } = values;

    // 加上传的文件加载仅 GraphScope
    const loadResult = await loadGraphToGraphScope({
      instanceId: currentInstanceId,
      nodeConfigList,
      edgeConfigList,
      fileMapping: filesMapping,
      directed,
      delimiter,
      hasHeaderRow,
      isStringType,
    });

    console.log('载图到 GraphScope 中', loadResult);
    setLoading(false);
    const { success: loadSuccess, message: loadMessage, data: loadData } = loadResult;
    if (!loadSuccess) {
      message.error(`数据加载失败: ${loadMessage}`);
      return;
    }

    const { graphName, graphURL } = loadData;
    localStorage.setItem('graphScopeGraphName', graphName);
    localStorage.setItem('graphScopeGremlinServer', graphURL);

    message.success('加载数据到 GraphScope 引擎成功');

    // 载图成功后，更新 Project 中的 SchemeData
    updateSchemaData();
    close();
  };

  const clearGraphScopeStorage = () => {
    localStorage.removeItem('graphScopeGraphName');
    localStorage.removeItem('graphScopeGremlinServer');
    localStorage.removeItem('graphScopeInstanceId');
    localStorage.removeItem('graphScopeFilesMapping');
  };

  const handleCloseGraph = async () => {
    if (graphScopeInstanceId) {
      setCloseLoading(true);
      // 清空localstorage 中的实例、图名称和Gremlin服务地址
      const result = await closeGraphInstance(graphScopeInstanceId);
      setCloseLoading(false);
      clearGraphScopeStorage();
      if (result && result.success) {
        // 提示
        message.success('关闭 GraphScope 实例成功');
        close();
      }
    }
  };

  const formInitValue = {
    type: 'LOCAL',
    directed: true,
    hasHeaderRow: true,
    delimiter: ',',
    nodeConfigList: [
      {
        nodeType: '',
      },
    ],
  };

  const fileProps = {
    beforeUpload: () => false,
  };
  return (
    <div>
      <Form name="gsform" form={form} initialValues={formInitValue}>
        <Radio.Group defaultValue={dataType} buttonStyle="solid" onChange={handleDataTypeChange}>
          <Radio.Button value="demo">p2p示例数据</Radio.Button>
          <Radio.Button value="chinavis">ChinaVis示例数据</Radio.Button>
          <Radio.Button value="real">我有数据</Radio.Button>
        </Radio.Group>
        {loading && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
            message="正在将点边数据载入到 GraphScope 引擎中，请耐心等待……"
          />
        )}
        {dataType === 'demo' && (
          <div style={{ marginTop: 16 }}>
            <p>默认使用 GraphScope 引擎内置的点边数据，文件基本信息如下</p>
            <p>点文件名称：p2p-31_property_v_0</p>
            <p>边文件：p2p-31_property_e_0</p>
            <p>测试数据共包括 62586 节点，147892 条边</p>
          </div>
        )}
        {dataType === 'chinavis' && (
          <div style={{ marginTop: 16 }}>
            <p>
              默认使用ChinaVis 赛道1{' '}
              <a href="http://chinavis.org/2022/challenge.html" target="_blank">
                数据安全可视分析
              </a>
              的点边数据，文件基本信息如下
            </p>
            <p>点文件名称：Node.csv</p>
            <p>边文件：Link.csv</p>
            <p>测试数据共包括 237 万个与黑灰产相关的网络资产（节点）和 328 万条资产关联关系</p>
            <p>点类型：</p>
            <Table
              columns={ChinaVisNodeColumns}
              dataSource={ChinaVisNodeData}
              pagination={{ hideOnSinglePage: true }}
            />
            <p>边类型：</p>
            <Table
              columns={ChinaVisEdgeColumns}
              dataSource={ChinaVisEdgeData}
              pagination={{ hideOnSinglePage: true, pageSize: 11 }}
            />
          </div>
        )}
        {dataType === 'real' && (
          <div style={{ marginTop: 16 }}>
            <Item label="模式" name="type" style={{ marginBottom: 8 }}>
              <Radio.Group defaultValue="LOCAL">
                <Radio value="LOCAL">本地文件</Radio>
                <Radio value="OSS" disabled>
                  OSS
                </Radio>
                <Radio value="ODPS" disabled>
                  ODPS
                </Radio>
              </Radio.Group>
            </Item>
            <Row>
              <Col span={11} style={{ marginRight: 24 }}>
                <h4>点配置列表</h4>
                <Form.List name="nodeConfigList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row
                          key={field.key}
                          style={{
                            border: '1px solid #ccc',
                            padding: 16,
                            paddingBottom: 0,
                            marginBottom: 16,
                          }}
                        >
                          <Col span={22} style={{ marginBottom: 16 }}>
                            <h5>第 {index + 1} 组点配置</h5>
                          </Col>
                          {index !== 0 && (
                            <Col span={2} style={{ textAlign: 'right', fontSize: 16 }}>
                              <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Col>
                          )}
                          <Col span={12}>
                            <Item label="点类型" name={[field.name, 'nodeType']}>
                              <Input style={{ width: 125 }} />
                            </Item>
                          </Col>
                          <Col span={12}>
                            <Item label="点数据文件" name={[field.name, 'nodeFileList']}>
                              <Upload {...fileProps} name="nodes" maxCount={1}>
                                <Button icon={<UploadOutlined />}>上传点文件</Button>
                              </Upload>
                            </Item>
                          </Col>
                        </Row>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          增加点配置
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
              <Col span={12}>
                <h4>边配置列表</h4>
                <Form.List name="edgeConfigList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row
                          key={field.key}
                          style={{
                            border: '1px solid #ccc',
                            padding: 16,
                            paddingBottom: 0,
                            marginBottom: 16,
                          }}
                        >
                          <Col span={22} style={{ marginBottom: 16 }}>
                            <h5>第 {index + 1} 组边配置</h5>
                          </Col>
                          <Col span={2} style={{ textAlign: 'right', fontSize: 16 }}>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                          </Col>
                          <Col span={12}>
                            <Item label="边文件类型" name={[field.name, 'edgeType']}>
                              <Input style={{ width: 125 }} />
                            </Item>
                          </Col>
                          <Col span={12}>
                            <Item label="边数据文件" name={[field.name, 'edgeFileList']}>
                              <Upload {...fileProps} name="edges" maxCount={1}>
                                <Button icon={<UploadOutlined />}>上传边文件</Button>
                              </Upload>
                            </Item>
                          </Col>
                          <Col span={12}>
                            <Item label="边起点类型" name={[field.name, 'sourceNodeType']}>
                              <Input style={{ width: 125 }} />
                            </Item>
                          </Col>
                          <Col span={12}>
                            <Item label="边终点类型" name={[field.name, 'targetNodeType']}>
                              <Input style={{ width: 125 }} />
                            </Item>
                          </Col>
                        </Row>
                      ))}

                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          增加边配置
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
            <Collapse>
              <Collapse.Panel header="高级配置" key="advanced-panel">
                <Item label="ID字段类型" name="isStringType">
                  <Switch checkedChildren="string" unCheckedChildren="int64" />
                </Item>
                <Item label="是否有向图" name="directed">
                  <Switch />
                </Item>
                <Item label="上传是否有标题行" name="hasHeaderRow">
                  <Switch />
                </Item>
                <Item label="文件分隔符" name="delimiter">
                  <Radio.Group>
                    <Radio value=",">逗号</Radio>
                    <Radio value=";">分号</Radio>
                    <Radio value="|">竖线</Radio>
                  </Radio.Group>
                </Item>
              </Collapse.Panel>
            </Collapse>
          </div>
        )}
        <Form.Item>
          <Space style={{ marginTop: 16 }}>
            <Popconfirm
              title="关闭 GraphScope 实例，就不能使用 Gremlin 查询，请确认关闭是否关闭？"
              onConfirm={handleCloseGraph}
              okText="确认"
              cancelText="取消"
            >
              <Button danger disabled={!graphScopeInstanceId} loading={closeLoading}>
                关闭 GraphScope 实例
              </Button>
            </Popconfirm>
            <Button onClick={close}>取消</Button>
            {dataType === 'real' && (
              <Button onClick={confirmUploadFiles} loading={uploadLoading}>
                上传文件
              </Button>
            )}
            <Button
              type="primary"
              disabled={dataType === 'real' && !filesMapping}
              onClick={handleSubmitForm}
              loading={loading}
            >
              开始载图
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GraphScopeMode;
