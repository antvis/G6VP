import React, { useState } from 'react';
import { Form, Radio, Upload, Button, Input, Switch, Collapse, message, Space, Popconfirm, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  uploadLocalFileToGraphScope,
  closeGraphInstance,
  createGraphScopeInstance,
  loadGraphToGraphScope,
} from '../../../services/graphcompute';
import { DefaultGraphScopeNodeFilePath, DefaultGraphScopeEdgeFilePath } from './const';
const { Item } = Form;

interface GraphModelProps {
  close: () => void;
}
const GraphScopeMode = ({ close }) => {
  const [form] = Form.useForm();

  const graphScopeInstanceId = localStorage.getItem('graphScopeInstanceId');
  const graphScopeGraphName = localStorage.getItem('graphScopeGraphName');

  const [dataType, setDataType] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const handleDataTypeChange = e => {
    console.log(e);
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
      const loadResult = await loadGraphToGraphScope({
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
      return;
    }

    const values = await form.validateFields();
    console.log('values', values);
    const {
      nodeFileList,
      edgeFileList,
      directed = true,
      nodeType,
      edgeType,
      sourceNodeType,
      targetNodeType,
      delimiter = ',',
      hasHeaderRow = true,
    } = values;

    // 上传点文件
    const nodeFileResult = await uploadLocalFileToGraphScope({
      fileList: nodeFileList,
      instanceId: currentInstanceId,
    });
    const { success, data } = nodeFileResult;
    if (!success) {
      setLoading(false);
      message.error('点文件上传失败');
      return;
    }
    const { filePath: nodeFilePath } = data;

    let edgeFilePath = '';
    // 上传边文件
    // 如果存在边文件，则上传
    if (edgeFileList) {
      const edgeFileResult = await uploadLocalFileToGraphScope({
        fileList: edgeFileList,
        instanceId: currentInstanceId,
      });

      const { success, data } = edgeFileResult;
      if (!success) {
        setLoading(false);
        message.error('点文件上传失败');
        return;
      }

      edgeFilePath = data.filePath;
    }

    // 加上传的文件加载仅 GraphScope
    const loadResult = await loadGraphToGraphScope({
      instanceId: currentInstanceId,
      nodeFilePath: nodeFilePath,
      nodeType,
      edgeType,
      sourceNodeType,
      targetNodeType,
      edgeFilePath,
      directed,
      delimiter,
      hasHeaderRow,
    });

    console.log('加载数据到 GraphScope', loadResult);
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
      if (result && result.success) {
        // 提示
        message.success('关闭 GraphScope 实例成功');
        clearGraphScopeStorage();
      }
    }
  };

  const formInitValue = {
    type: 'LOCAL',
    directed: true,
    hasHeaderRow: true,
    delimiter: ',',
  };

  const fileProps = {
    beforeUpload: () => false,
  };
  return (
    <div>
      <Form name="gsform" form={form} initialValue={formInitValue}>
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
            <Item label="模式" name="type">
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
            <Item label="点类型" name="nodeType" rules={[{ required: true, message: '请输入点类型!' }]}>
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
            </Item>
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
            <Button onClick={handleSubmitForm}>取消</Button>
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
