import React, { useState } from 'react';
import {
  Form,
  Radio,
  Upload,
  Button,
  Input,
  Switch,
  Collapse,
  message,
  Space,
  Popconfirm,
  Alert,
  Row,
  Col,
} from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  uploadLocalFileToGraphScope,
  closeGraphInstance,
  createGraphScopeInstance,
  loadGraphToGraphScope,
  loadDefaultGraphToGraphScope,
} from '../../../services/graphcompute';
import { DefaultGraphScopeNodeFilePath, DefaultGraphScopeEdgeFilePath } from './const';
const { Item } = Form;

interface GraphModelProps {
  close: () => void;
}
const GraphScopeMode: React.FC<GraphModelProps> = ({ close }) => {
  const [form] = Form.useForm();

  const graphScopeInstanceId = localStorage.getItem('graphScopeInstanceId');
  const graphScopeGraphName = localStorage.getItem('graphScopeGraphName');

  const [dataType, setDataType] = useState('real');
  const [loading, setLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const handleDataTypeChange = e => {
    setDataType(e.target.value);
  };
  const handleSubmitForm = async () => {
    let currentInstanceId = graphScopeInstanceId;
    setLoading(true);
    // 不存在 GraphScope 实例，则进行创建
    if (!graphScopeInstanceId) {
      // step1: 初始化 GraphScope 引擎
      const gsResult = await createGraphScopeInstance();

      if (!gsResult || !gsResult.success) {
        setLoading(false);
        message.error(`创建 GraphScope 引擎实例失败: ${gsResult.message}`);
        return null;
      }

      const { data } = gsResult;
      const { instanceId } = data;
      // 将 instanceId 存储到 localstorage 中
      localStorage.setItem('graphScopeInstanceId', instanceId);

      currentInstanceId = instanceId;
    }

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
      // 关闭弹框
      close();
      const { graphName, graphURL } = data;
      localStorage.setItem('graphScopeGraphName', graphName);
      localStorage.setItem('graphScopeGremlinServer', graphURL);
      return;
    }

    const values = await form.validateFields();

    const { nodeConfigList, edgeConfigList, directed = true, delimiter = ',', hasHeaderRow = true } = values;
    const nodeFileLists = nodeConfigList.filter(d => d.nodeFileList && d.nodeType).map(d => d.nodeFileList);
    const nodeFilePromise = nodeFileLists.map(d => {
      // 上传点文件
      const nodeFileResult = uploadLocalFileToGraphScope({
        fileList: d,
        instanceId: currentInstanceId,
      });
      return nodeFileResult;
    });

    const edgeFileLists = edgeConfigList
      .filter(d => d.edgeType && d.sourceNodeType && d.targetNodeType)
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

    // 加上传的文件加载仅 GraphScope
    const loadResult = await loadGraphToGraphScope({
      instanceId: currentInstanceId,
      nodeConfigList,
      edgeConfigList,
      fileMapping: filePathMapping,
      directed,
      delimiter,
      hasHeaderRow,
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
    close();
  };

  const clearGraphScopeStorage = () => {
    localStorage.removeItem('graphScopeGraphName');
    localStorage.removeItem('graphScopeGremlinServer');
    localStorage.removeItem('graphScopeInstanceId');
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
          <Radio.Button value="demo">示例数据</Radio.Button>
          <Radio.Button value="real">我有数据</Radio.Button>
        </Radio.Group>
        {loading && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
            message="正在创建 GraphScope 实例、上传点边文件，并将点边数据载入到 GraphScope 引擎中，请耐心等待……"
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

            {/* <Item label="点类型" name="nodeType" rules={[{ required: true, message: '请输入点类型!' }]}>
              <Input style={{ width: 200 }} />
            </Item>
            <Item label="点文件" name="nodeFileList" rules={[{ required: true, message: '请上传点文件!' }]}>
              <Upload {...fileProps} name="nodes" maxCount={1}>
                <Button icon={<UploadOutlined />}>上传点文件</Button>
              </Upload>
            </Item>
            <Item label="边文件" name="edgeFileList">
              <Upload {...fileProps} name="edges" maxCount={1}>
                <Button icon={<UploadOutlined />}>上传边文件</Button>
              </Upload>
            </Item>
            <Item label="边类型" name="edgeType">
              <Input style={{ width: 200 }} />
            </Item>
            <Item label="边起点类型" name="sourceNodeType">
              <Input style={{ width: 200 }} />
            </Item>
            <Item label="边终点类型" name="targetNodeType">
              <Input style={{ width: 200 }} />
            </Item> */}
            <Collapse>
              <Collapse.Panel header="高级配置" key="advanced-panel">
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
            <Button type="primary" onClick={handleSubmitForm} loading={loading}>
              进入分析
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GraphScopeMode;
