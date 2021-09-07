import { Pie } from '@ant-design/charts';
import { Card, Select } from 'antd';
import React from 'react';

const { Option } = Select;
interface PieAnalysisProps {
  nodes: {
    id: string;
    data: Record<string, any>;
  }[];
  keys: string[];
}

const PieAnalysis: React.FunctionComponent<PieAnalysisProps> = props => {
  const { keys: defaultKeys, nodes } = props;
  const keys = defaultKeys.filter(c => {
    return c !== 'label' && c !== 'id';
  });
  const defaultKey = keys[0];
  const [activeKey, setActiveKey] = React.useState(defaultKey);

  const data = nodes.map(c => {
    const { id, data } = c;
    return {
      type: id,
      value: data[activeKey],
    };
  });

  const config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        const percent = _ref.percent;
        return ''.concat((percent * 100).toFixed(0), '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };
  const handleChange = val => {
    setActiveKey(val);
  };
  const Filter = (
    <Select value={activeKey} style={{ width: 120 }} onChange={handleChange}>
      {keys.map(c => {
        return (
          <Option value={c} key={c}>
            {c}
          </Option>
        );
      })}
    </Select>
  );
  return (
    <Card title="分布分析" extra={Filter}>
      <Pie {...config} />
    </Card>
  );
};

export default PieAnalysis;
