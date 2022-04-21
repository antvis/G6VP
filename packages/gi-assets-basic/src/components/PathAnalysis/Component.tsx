import React from 'react';
import { useContext } from '@alipay/graphinsight';
import { Algorithm } from '@antv/g6';
import { Form, Select, Button, Timeline } from 'antd';
import { useImmer } from 'use-immer';
import { IState } from './typing';
const PathAnalysis = () => {
  const { data: graphData } = useContext();
  const [state, updateState] = useImmer<IState>({
    allPath: [],
  });
  const [form] = Form.useForm();
  const { findShortestPath, findAllPath } = Algorithm as any;

  const handleResetForm = () => {
    form.resetFields();
  };

  const handleSearch = () => {
    form.validateFields().then(values => {
      const { source, target } = values;
      const allPath = findAllPath(graphData, source, target, true);
      updateState(draft => {
        draft.allPath = allPath;
      })
      console.log(allPath, '@allPath');
    });
  };

  return (
    <div className="gi-path-analysis">
      <h2 className="gi-path-analysis-title">路径查询</h2>
      <Form form={form}>
        <Form.Item label="起点节点ID" name="source" rules={[{ required: true, message: '请填写起点节点ID' }]}>
          <Select showSearch optionFilterProp="children">
            {graphData.nodes.map(node => (
              <Select.Option key={node.id} value={node.id}>
                {node.id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="终点节点ID" name="target" rules={[{ required: true, message: '请填写终点节点ID' }]}>
          <Select showSearch optionFilterProp="children">
            {graphData.nodes.map(node => (
              <Select.Option key={node.id} value={node.id}>
                {node.id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button style={{ marginRight: 8 }} onClick={handleResetForm}>
            重置
          </Button>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Form.Item>
      </Form>
      
    </div>
  );
};

export default PathAnalysis;
