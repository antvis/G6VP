import { GISiteParams } from '@antv/gi-sdk';
import { Alert, Form, message } from 'antd';
import React, { useState } from 'react';
import { LoadChinaVisDataSource } from '../Constants';
import {
  createGraphScopeInstance,
  loadChinaVisGraphToGraphScope,
  loadGraphToGraphScope,
  queryGraphSchema,
  uploadLocalFileToGraphScope,
} from '../GraphScopeService';
import GSDataMode from './GSDataMode';

export interface GraphModelProps {
  updateGISite?: (params: GISiteParams) => void;
  onClose: () => void;
}
const GraphScopeMode: React.FC<GraphModelProps> = ({ onClose, updateGISite }) => {
  const [form] = Form.useForm();

  const graphScopeFilesMapping = JSON.parse(localStorage.getItem('graphScopeFilesMapping') as string);

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [filesMapping, setFilesMapping] = useState(graphScopeFilesMapping);

  /**
   * 实例化GraphScope引擎实例
   */
  const initGraphScopeInstance = async () => {
    const projectId = localStorage.getItem('GI_ACTIVE_PROJECT_ID');

    if (!projectId) {
      message.error(`不存在 ID 为 ${projectId} 的项目`);
      return null;
    }
    // step1: 初始化 GraphScope 引擎
    const gsResult = await createGraphScopeInstance();

    if (!gsResult || !gsResult.success) {
      message.error(`创建 GraphScope 引擎实例失败: ${gsResult.message}`);
      return null;
    }

    const { data } = gsResult;
    const { instanceId } = data;

    return instanceId;
  };

  const handleUploadFiles = async (isCover = false) => {
    setUploadLoading(true);
    const currentInstanceId = await initGraphScopeInstance();
    const values = await form.validateFields();

    // 如果 isCover = false， 则需要先过滤掉 nodeConfigList, edgeConfigList 中已经存在于 localstorage 中的文件
    const { nodeConfigList = [], edgeConfigList = [] } = values;

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
      return false;
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
    message.success('文件上传成功，开始载图……');
    return true;
  };

  const handleSubmitForm = async (dataType: 'LOCAL' | 'DEMO') => {
    setLoading(true);

    // 载图 ChinaVis 示例数据
    if (dataType === 'DEMO') {
      // loadChinaVisGraphToGraphScope
      const loadResult = await loadChinaVisGraphToGraphScope({
        dataSource: LoadChinaVisDataSource,
      });

      setLoading(false);
      console.log('加载数据到 GraphScope', loadResult);
      // 每次载图以后，获取最新 Gremlin server
      const { success: loadSuccess, message: loadMessage, data } = loadResult;
      if (!loadSuccess) {
        message.error(`数据加载失败: ${loadMessage}`);
        return false;
      }
      message.success('加载数据到 GraphScope 引擎成功');
      const { graphName } = data;
      localStorage.setItem('graphScopeGraphName', graphName);

      // 关闭弹框
      onClose();
      const schemaData = (await queryGraphSchema()) || { nodes: [], edges: [] };
      console.log('schemaData', schemaData);
      if (updateGISite) {
        updateGISite({
          engineId: 'GS',
          schemaData: schemaData,
          engineContext: {},
        });
      }
      return true;
    }

    const allFilesMapping = JSON.parse(localStorage.getItem('graphScopeFilesMapping') as string);

    // 没有上传文件
    if (!filesMapping && !allFilesMapping) {
      message.error('请先上传文件后再进行载图');
      return false;
    }

    const values = await form.validateFields();
    console.log('xxx', values);

    const { nodeConfigList, edgeConfigList = [] } = values as any;

    // 加上传的文件加载仅 GraphScope
    const loadResult = await loadGraphToGraphScope({
      nodeConfigList,
      edgeConfigList,
      fileMapping: filesMapping || allFilesMapping,
    });

    console.log('载图到 GraphScope 中', loadResult);
    setLoading(false);
    const { success: loadSuccess, message: loadMessage, data: loadData } = loadResult;
    if (!loadSuccess) {
      message.error(`数据加载失败: ${loadMessage}`);
      return false;
    }

    const { graphName, graphURL } = loadData;
    localStorage.setItem('graphScopeGraphName', graphName);
    localStorage.setItem('graphScopeGremlinServer', graphURL);

    message.success('加载数据到 GraphScope 引擎成功');

    onClose();
    return true;
  };

  const formInitValue = {
    type: 'LOCAL',
    isStringType: true,
    engineServerURL: ['https://gi-api.graphscope.app'],
    httpServerURL: [' https://gi-api.graphscope.app'], //'https://graphinsight.antgroup-inc.cn',
    nodeConfigList: [
      {
        nodeType: '',
      },
    ],
  };

  return (
    <div>
      <Form name="gsform" form={form} initialValues={formInitValue}>
        {loading && (
          <Alert
            type="info"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
            message="正在将点边数据载入到 GraphScope 引擎中，请耐心等待……"
          />
        )}
        <GSDataMode
          handleUploadFile={handleUploadFiles}
          handleLoadData={handleSubmitForm}
          onClose={onClose}
          filesMapping={filesMapping}
          uploadLoading={uploadLoading}
          loading={loading}
          form={form}
        />
      </Form>
    </div>
  );
};

export default GraphScopeMode;
