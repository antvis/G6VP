import { Card, Select } from 'antd';
import * as React from 'react';
import PieAnalysis from './PieAnalysis';

const { Option } = Select;

interface NodeProfileProps {
  nodes: any[];
}

const NodeProfile: React.FunctionComponent<NodeProfileProps> = props => {
  const { nodes } = props;
  const keys = Object.keys(nodes[0].data);

  const keyOptions = keys.map(key => {
    return (
      <Option key={key} value={key}>
        {key}
      </Option>
    );
  });
  const handleChange = value => {
    console.log(value, 'value');
  };
  return (
    <div>
      <div style={{ border: '1px dash green' }}>
        <Card title="自助分析">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="选择分析字段"
            defaultValue={keys}
            onChange={handleChange}
          >
            {keyOptions}
          </Select>
        </Card>
      </div>

      <br />
      <div>
        <PieAnalysis nodes={nodes} keys={keys} />
      </div>
    </div>
  );
};

export default NodeProfile;
