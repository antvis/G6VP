import React from 'react';
import { Form, Radio, Upload, Button, Input, Switch, Collapse } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { exportLocalDataToGraphScope, closeGraphInstance } from '../../../services/graphcompute';
const { Item } = Form;

const GraphScopeMode = () => {
  const [form] = Form.useForm();

  const handleSubmitForm = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    const result = await exportLocalDataToGraphScope(values);
    console.log('GraphScope 导入数据', result);
  };

  const handleCloseGraph = async () => {
    // const result = await closeGraphInstance()
    // console.log('关闭 GraphScope 实例', result)
  };

  const formInitValue = {
    type: 'LOCAL',
    directed: true,
    hasHeaderRow: true,
    delimiter: ',',
  };
  return (
    <div>
      <Form name="gsform" form={form} initialValue={formInitValue}>
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
          <Upload name="nodes" maxCount={1}>
            <Button icon={<UploadOutlined />}>上传点文件</Button>
          </Upload>
        </Item>
        <Item label="边文件" name="edgeFileList">
          <Upload name="edges" maxCount={1}>
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
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={handleCloseGraph}>关闭 GraphScope 实例</Button>
          <Button type="primary" onClick={handleSubmitForm}>
            进入分析
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GraphScopeMode;
