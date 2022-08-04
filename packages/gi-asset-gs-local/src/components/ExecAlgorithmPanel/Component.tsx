import React, { useState } from 'react';
import { Form, InputNumber, Input, Select, Button, Switch, message } from 'antd';
import { useContext, utils } from '@alipay/graphinsight';
import AlgorithmResultPanel from './AlgorithmResultPanel';
import { Parser } from 'json2csv';

const { Option } = Select;

const ExecAlgorithmPanel = ({ serviceId }) => {
  const [form] = Form.useForm();
  const { services } = useContext();

  const service = utils.getService(services, serviceId);

  const [algorithmParams, setAlgorithmParams] = useState({});
  const [params, setParams] = useState({
    visible: false,
    btnLoading: false,
    algorithmData: [],
  });

  const handleExecAlgorithm = async () => {
    console.log('算法参数', algorithmParams);

    setParams({
      ...params,
      btnLoading: true,
    });
    const result = await service(algorithmParams);

    console.log('Gremlin 算法结果', result);
    if (!result || !result.success) {
      message.error(`执行图算法失败：${result.message}`);
      return;
    }

    if (result.data.length > 50) {
      // 数量过多，结果下载成 csv 文件
      const json2csvParser = new Parser({ delimiter: ',' });
      const csvStr = json2csvParser.parse(result.data);
      const a = document.createElement('a');
      a.href = 'data:text/csv;charset=utf-8,' + encodeURI(`${csvStr}`);
      a.download = `${algorithmType}.csv`;
      a.click();
    } else {
      setParams({
        visible: true,
        btnLoading: false,
        algorithmData: result.data,
      });
    }
  };

  const handleFormValueChange = (current, all) => {
    console.log(current, all);
    setAlgorithmParams(all);
  };

  const [algorithmType, setAlgorithmType] = useState('pagerank');
  const handleTypeChange = value => {
    setAlgorithmType(value);
  };

  const initFormValue = {
    name: 'pagerank',
    delta: 0.85,
    sortById: true,
    maxRound: 10,
    limit: 100,
  };

  return (
    <div className="gi-algorithm-analysis">
      <Form form={form} onValuesChange={handleFormValueChange} initialValues={initFormValue}>
        <Form.Item name="name" label="算法类型">
          <Select placeholder="请选择算法" onChange={handleTypeChange} allowClear>
            <Option value="pagerank">PageRank</Option>
            <Option value="sssp">单源最短路径</Option>
            <Option value="clustering">clustering</Option>
            <Option value="wcc">wcc</Option>
            <Option value="lpa">LPA</Option>
            <Option value="k_core">K-core</Option>
            <Option value="eigenvector_centrality">eigenvector_centrality</Option>
          </Select>
        </Form.Item>
        {(algorithmType === 'pagerank' || algorithmType === 'eigenvector_centrality' || algorithmType === 'lpa') && (
          <Form.Item name="maxRound" label="maxRound">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        )}
        {algorithmType === 'pagerank' && (
          <Form.Item name="delta" label="delta">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        )}
        <Form.Item name="vertex_label" label="节点类型">
          <Input />
        </Form.Item>
        <Form.Item name="edge_label" label="边类型">
          <Input />
        </Form.Item>
        {(algorithmType === 'eigenvector_centrality' || algorithmType === 'sssp') && (
          <Form.Item name="weight" label="权重">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        )}
        {algorithmType === 'sssp' && (
          <Form.Item name="src" label="源节点ID">
            <Input />
          </Form.Item>
        )}
        {algorithmType === 'k_core' && (
          <Form.Item name="k" label="k">
            <Input />
          </Form.Item>
        )}
        {algorithmType === 'eigenvector_centrality' && (
          <Form.Item name="tolerance" label="tolerance">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        )}
        <Form.Item name="limit" label="限制数量">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="sortById" label="是否根据ID排序">
          <Switch defaultChecked />
        </Form.Item>
        <Form.Item name="colomnName" label="追加字段名称">
          <Input />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleExecAlgorithm} loading={params.btnLoading}>
            执行算法
          </Button>
        </Form.Item>
      </Form>
      <AlgorithmResultPanel
        visible={params.visible}
        algorithmType={algorithmType}
        data={params.algorithmData}
        close={() =>
          setParams({
            ...params,
            visible: false,
          })
        }
      />
    </div>
  );
};

export default ExecAlgorithmPanel;
