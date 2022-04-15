import React, { useState } from 'react';
import { Form, Radio, Upload, Button, Input, Switch, Collapse, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  uploadLocalFileToGraphScope,
  closeGraphInstance,
  createGraphScopeInstance,
  findNodeById,
  gremlinQuery,
  loadGraphToGraphScope,
} from '../../../services/graphcompute';
import { DefaultGraphScopeNodeFilePath, DefaultGraphScopeEdgeFilePath } from './const';
import { useContext } from '../../Analysis/hooks/useContext';
const { Item } = Form;

const GraphScopeMode = () => {
  const [form] = Form.useForm();

  const { context, updateContext } = useContext();
  const { graphScopeInstanceId } = context;

  const [dataType, setDataType] = useState('demo');

  const handleDataTypeChange = e => {
    console.log(e);
    setDataType(e.target.value);
  };
  const handleSubmitForm = async () => {
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
      // 将 instanceId 存储到 context 中

      updateContext(draft => {
        draft.graphScopeInstanceId = instanceId;
      });

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

      console.log('加载数据到 GraphScope', loadResult);
      const { success: loadSuccess, message: loadMessage } = loadResult;
      if (!loadSuccess) {
        message.error(`数据加载失败: ${loadMessage}`);
        return;
      }
      message.success('加载数据到 GraphScope 引擎成功');
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
    console.log('GraphScope 导入数据', nodeFileResult);
    const { success, data } = nodeFileResult;
    if (!success) {
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
    const { success: loadSuccess, message: loadMessage } = loadResult;
    if (!loadSuccess) {
      message.error(`数据加载失败: ${loadMessage}`);
      return;
    }
    message.success('加载数据到 GraphScope 引擎成功');
  };

  const handleCloseGraph = async () => {
    if (graphScopeInstanceId) {
      const result = await closeGraphInstance(graphScopeInstanceId);
      console.log('关闭 GraphScope 实例', result);
    }
  };

  const handleCreateGreml = async () => {
    const result = await gremlinQuery('g.V(1)');
    console.log('Gremlin 查询', result);
  };

  const handleByID = async () => {
    const result = await findNodeById('1');
    console.log('ID 查询', result);
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
        {dataType === 'real' && (
          <>
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
          </>
        )}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={handleCloseGraph}>关闭 GraphScope 实例</Button>
          <Button onClick={handleCreateGreml}>Gremlin 查询</Button>
          <Button onClick={handleByID}>节点 ID 查询</Button>
          <Button type="primary" onClick={handleSubmitForm}>
            进入分析
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GraphScopeMode;
