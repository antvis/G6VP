import { Alert, Button, Form, message, Radio, Space, Table, Select } from 'antd';
import React, { useState } from 'react';
import {
  createGraphScopeInstance,
  loadChinaVisGraphToGraphScope,
  loadDefaultGraphToGraphScope,
  loadGraphToGraphScope,
  uploadLocalFileToGraphScope,
  queryGraphSchema,
  jsonToGremlin,
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
import LocalFilePanel from './LocalFilePanel';
import { useContext } from '../hooks/useContext';

const MOCK_PATTERN_DATA = {
  p1: {
    nodes: [
      {
        id: 'node0', // id 是随机生成的，用于唯一标识这个 pattern 中的一个节点，以及 edges 中标识起点和终点，匹配计算时不用关注
        nodeType: 'Person', // 节点类型
        // 属性条件数组，一项代表一个属性条件，且的关系
        rules: [
          // 下面这条属性约束这个节点属性名为 property1 的值需要 > 100
          {
            key: 'property1',
            rule: '>', // 可以是：'>' | '>=' | '<=' | '<' | '=' | '!=' | 'like' | 'unlike',
            value: 100,
          },
          // 下面这条属性约束这个节点属性名为 property2 的值需要 = "xxxxx"
          {
            key: 'property2',
            rule: '=',
            value: 'xxxxx',
          },
        ],
      },
      {
        id: 'node1',
        nodeType: 'Company',
        rules: [
          {
            key: 'property3',
            rule: '=',
            value: 'yyyy',
          },
          {
            key: 'property4',
            rule: 'like',
            value: 'xxxx',
          },
        ],
      },
      {
        id: 'node2',
        nodeType: 'Person',
        rules: [],
      },
    ],
    edges: [
      {
        id: 'edge0', // id 是随机生成的，用于唯一标识这个 pattern 中的一条边，匹配计算时不用关注
        source: 'node0', // 起点 id
        target: 'node1', // 终点 id
        edgeType: 'Manager', // 边类型
        sourceNodeType: 'Person', // 节点类型
        targeteEdgeType: 'Company', // 边类型
        rules: [], // 同节点中的 rules
      },
      {
        id: 'edge1',
        source: 'node2',
        target: 'node1',
        edgeType: 'Employer',
        sourceNodeType: 'Person',
        targeteEdgeType: 'Company',
        rules: [],
      },
    ],
  },
  p2: {
    nodes: [
      {
        id: 'node0', // id 是随机生成的，用于唯一标识这个 pattern 中的一个节点，以及 edges 中标识起点和终点，匹配计算时不用关注
        nodeType: 'Person', // 节点类型
        // 属性条件数组，一项代表一个属性条件，且的关系
        rules: [
          // 下面这条属性约束这个节点属性名为 property1 的值需要 > 100
          {
            key: 'property1',
            rule: '>', // 可以是：'>' | '>=' | '<=' | '<' | '=' | '!=' | 'like' | 'unlike',
            value: 100,
          },
          // 下面这条属性约束这个节点属性名为 property2 的值需要 = "xxxxx"
          {
            key: 'property2',
            rule: '=',
            value: 'xxxxx',
          },
        ],
      },
      {
        id: 'node1',
        nodeType: 'Company',
        rules: [
          {
            key: 'property3',
            rule: '=',
            value: 'yyyy',
          },
          {
            key: 'property4',
            rule: 'like',
            value: 'xxxx',
          },
        ],
      },
      {
        id: 'node2',
        nodeType: 'Person',
        rules: [],
      },
      {
        id: 'node3',
        nodeType: 'Shop',
        rules: [],
      },
      {
        id: 'node4',
        nodeType: 'Shop',
        rules: [],
      },
    ],
    edges: [
      {
        id: 'edge0', // id 是随机生成的，用于唯一标识这个 pattern 中的一条边，匹配计算时不用关注
        source: 'node0', // 起点 id
        target: 'node1', // 终点 id
        edgeType: 'Manager', // 边类型
        sourceNodeType: 'Person', // 节点类型
        targeteEdgeType: 'Company', // 边类型
        rules: [], // 同节点中的 rules
      },
      {
        id: 'edge1',
        source: 'node0',
        target: 'node2',
        edgeType: 'Knows',
        sourceNodeType: 'Person',
        targeteEdgeType: 'Person',
        rules: [],
      },
      {
        id: 'edge2',
        source: 'node0',
        target: 'node3',
        edgeType: 'Owns',
        sourceNodeType: 'Person',
        targeteEdgeType: 'Shop',
        rules: [],
      },
      {
        id: 'edge3',
        source: 'node2',
        target: 'node4',
        edgeType: 'Owns',
        sourceNodeType: 'Person',
        targeteEdgeType: 'Shop',
        rules: [],
      },
    ],
  },
  p3: {
    nodes: [
      {
        id: 'node0', // id 是随机生成的，用于唯一标识这个 pattern 中的一个节点，以及 edges 中标识起点和终点，匹配计算时不用关注
        nodeType: 'Person', // 节点类型
        // 属性条件数组，一项代表一个属性条件，且的关系
        rules: [
          // 下面这条属性约束这个节点属性名为 property1 的值需要 > 100
          {
            key: 'property1',
            rule: '>', // 可以是：'>' | '>=' | '<=' | '<' | '=' | '!=' | 'like' | 'unlike',
            value: 100,
          },
          // 下面这条属性约束这个节点属性名为 property2 的值需要 = "xxxxx"
          {
            key: 'property2',
            rule: '=',
            value: 'xxxxx',
          },
        ],
      },
      {
        id: 'node1',
        nodeType: 'Company',
        rules: [
          {
            key: 'property3',
            rule: '=',
            value: 'yyyy',
          },
          {
            key: 'property4',
            rule: 'like',
            value: 'xxxx',
          },
        ],
      },
      {
        id: 'node2',
        nodeType: 'Person',
        rules: [],
      },
    ],
    edges: [
      {
        id: 'edge0', // id 是随机生成的，用于唯一标识这个 pattern 中的一条边，匹配计算时不用关注
        source: 'node0', // 起点 id
        target: 'node1', // 终点 id
        edgeType: 'Manager', // 边类型
        sourceNodeType: 'Person', // 节点类型
        targeteEdgeType: 'Company', // 边类型
        rules: [], // 同节点中的 rules
      },
      {
        id: 'edge1',
        source: 'node2',
        target: 'node1',
        edgeType: 'Employer',
        sourceNodeType: 'Person',
        targeteEdgeType: 'Company',
        rules: [],
      },
      {
        id: 'edge2',
        source: 'node0',
        target: 'node2',
        edgeType: 'Knows',
        sourceNodeType: 'Person',
        targeteEdgeType: 'Person',
        rules: [],
      },
    ],
    combos: [],
  },
  p4: {
    "nodes":[
        {
            "id":"node-10eb99ff4e6fb",
            "nodeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"node-2ca73d02e1f23",
            "nodeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-393d2441b8513",
            "nodeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"node-4c0aff10e5327",
            "nodeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-190d4922cf2f2",
            "nodeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"node-23d07f6724913",
            "nodeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-3873052d30f43",
            "nodeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"node-43a58202e40fe",
            "nodeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"f0138207470c",
            "nodeType":"Domain",
            "rules":[
  
            ]
        }
    ],
    "edges":[
        {
            "id":"dde48955bfd0",
            "source":"node-10eb99ff4e6fb",
            "target":"node-2ca73d02e1f23",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"26df955d6544",
            "source":"node-190d4922cf2f2",
            "target":"node-23d07f6724913",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"d78f12b8037c",
            "source":"node-3873052d30f43",
            "target":"node-43a58202e40fe",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-393d2441b8513-node-2ca73d02e1f23-0-3321486916",
            "source":"node-393d2441b8513",
            "target":"node-2ca73d02e1f23",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-393d2441b8513-node-4c0aff10e5327-0-0648804345",
            "source":"node-393d2441b8513",
            "target":"node-4c0aff10e5327",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-190d4922cf2f2-node-4c0aff10e5327-0-2938829624",
            "source":"node-190d4922cf2f2",
            "target":"node-4c0aff10e5327",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-3873052d30f43-node-23d07f6724913-0-2684346137",
            "source":"node-3873052d30f43",
            "target":"node-23d07f6724913",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-10eb99ff4e6fb-node-43a58202e40fe-0-1084286592",
            "source":"node-10eb99ff4e6fb",
            "target":"node-43a58202e40fe",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-3873052d30f43-node-2ca73d02e1f23-0-2136871468",
            "source":"node-3873052d30f43",
            "target":"node-2ca73d02e1f23",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-190d4922cf2f2-node-2ca73d02e1f23-0-2588011832",
            "source":"node-190d4922cf2f2",
            "target":"node-2ca73d02e1f23",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-10eb99ff4e6fb-node-23d07f6724913-0-6501919862",
            "source":"node-10eb99ff4e6fb",
            "target":"node-23d07f6724913",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-393d2441b8513-node-23d07f6724913-0-8680761316",
            "source":"node-393d2441b8513",
            "target":"node-23d07f6724913",
            "edgeType":"r_cert",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Cert",
            "rules":[
  
            ]
        },
        {
            "id":"node-3873052d30f43-node-4c0aff10e5327-0-8475331677",
            "source":"node-3873052d30f43",
            "target":"node-4c0aff10e5327",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-10eb99ff4e6fb-node-4c0aff10e5327-0-8591424789",
            "source":"node-10eb99ff4e6fb",
            "target":"node-4c0aff10e5327",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-393d2441b8513-node-43a58202e40fe-0-5933571649",
            "source":"node-393d2441b8513",
            "target":"node-43a58202e40fe",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"node-190d4922cf2f2-node-43a58202e40fe-0-9450985543",
            "source":"node-190d4922cf2f2",
            "target":"node-43a58202e40fe",
            "edgeType":"r_dns_a",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"IP",
            "rules":[
  
            ]
        },
        {
            "id":"f0138207470c-node-3873052d30f43-0-2654713493",
            "source":"f0138207470c",
            "target":"node-3873052d30f43",
            "edgeType":"r_cname",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"f0138207470c-node-10eb99ff4e6fb-0-2087826154",
            "source":"f0138207470c",
            "target":"node-10eb99ff4e6fb",
            "edgeType":"r_cname",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"f0138207470c-node-393d2441b8513-0-7700013370",
            "source":"f0138207470c",
            "target":"node-393d2441b8513",
            "edgeType":"r_cname",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Domain",
            "rules":[
  
            ]
        },
        {
            "id":"f0138207470c-node-190d4922cf2f2-0-3377620062",
            "source":"f0138207470c",
            "target":"node-190d4922cf2f2",
            "edgeType":"r_cname",
            "sourceNodeType":"Domain",
            "targeteEdgeType":"Domain",
            "rules":[
  
            ]
        }
    ]
  }
};

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
  const [filesMapping, setFilesMapping] = useState(graphScopeFilesMapping);
  const [formValue, setFormValue] = useState({});

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

  const handleUploadFiles = async (isCover = false) => {
    setUploadLoading(true);
    const currentInstanceId = await initGraphScopeInstance();
    const values = await form.validateFields();

    setFormValue(values);
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
    message.success('文件上传成功，可以点击进入分析开始载图并分析');
    return true;
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
    const { isStringType = true } = values;
    console.log('xxx', formValue, values);

    const {
      nodeConfigList,
      edgeConfigList = [],
      directed = true,
      delimiter = ',',
      hasHeaderRow = true,
    } = formValue as any;

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

  // TODO：临时测试，后面需要删掉
  const [pattern, setPattern] = useState({
    type: 'p4',
    context: MOCK_PATTERN_DATA['p4'],
  });
  const handleChangePattern = value => {
    setPattern({
      type: value,
      context: MOCK_PATTERN_DATA[value],
    });
  };

  const handleToGremlin = async () => {
    const result = await jsonToGremlin(pattern.context);
    console.log(result);
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
            <Select defaultValue={pattern.type} onChange={handleChangePattern} style={{ width: 150 }}>
              <Select.Option value="p1">Pattern1</Select.Option>
              <Select.Option value="p2">Pattern2</Select.Option>
              <Select.Option value="p3">Pattern3</Select.Option>
            </Select>
            <p>Pattern 描述如下：</p>
            <pre>{JSON.stringify(pattern.context, null, 2)}</pre>
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
          <LocalFilePanel
            handleUploadFile={handleUploadFiles}
            handleLoadData={handleSubmitForm}
            close={close}
            filesMapping={filesMapping}
            uploadLoading={uploadLoading}
            loading={loading}
          />
        )}
        {dataType !== 'real' && (
          <Form.Item>
            <Space style={{ marginTop: 16 }}>
              <Button onClick={close}>取消</Button>
              <Button
                type="primary"
                disabled={dataType === 'real' && !filesMapping}
                onClick={handleSubmitForm}
                loading={loading}
              >
                开始载图
              </Button>
              <Button onClick={handleToGremlin}>测试Gremlin转换</Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default GraphScopeMode;
