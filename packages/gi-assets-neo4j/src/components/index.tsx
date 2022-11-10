import { GISiteParams } from '@antv/gi-sdk';
import { Form, message } from 'antd';
import React, { useState } from 'react';
import { connectNeo4jService } from '../services/Neo4jService';
import ConnectNeo4j from './Connect';

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

  const handleConnectGs = async () => {
    const values = await form.validateFields();
    // 调用接口，将用户输入的服务地址及 ID 类型缓存起来，供后面的服务使用
    const result = await connectNeo4jService(values);
    if (!result.success) {
      message.error('连接GraphScope失败');
      return;
    }
    message.success('连接成功');
  };

  const formInitValue = {
    type: 'LOCAL',
    isStringType: true,
    engineServerURL: ['http://11.166.85.48:9527'],
    httpServerURL: ['http://127.0.0.1:7001'], //'https://graphinsight.antgroup-inc.cn',
    nodeConfigList: [
      {
        nodeType: '',
      },
    ],
  };

  return (
    <div>
      <Form name="gsform" form={form} initialValues={formInitValue}>
        <ConnectNeo4j />
      </Form>
    </div>
  );
};

export default GraphScopeMode;
