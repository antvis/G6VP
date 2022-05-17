import { InputNumber, Space } from 'antd';
import React from 'react';

interface IOffsetProps {
  value: number[];
  min?: number;
  max?: number;
  defaultValue?: number[];
  onChange: (value: number[]) => void;
}

const Offset: React.FC<IOffsetProps> = props => {
  const { value = [100, 100], min = 0, max = 200 } = props;
  const [x, y] = value;
  //const [defaultX, defaultY] = defaultValue;

  return (
    <Space>
      <InputNumber
        size="small"
        //defaultValue={defaultX}
        value={x}
        min={min}
        max={max}
        onChange={v => {
          props.onChange([v, y]);
        }}
        placeholder="X轴偏移量"
      />
      <InputNumber
        size="small"
        //defaultValue={defaultY}
        value={y}
        min={min}
        max={max}
        onChange={v => {
          props.onChange([x, v]);
        }}
        placeholder="Y轴偏移量"
      />
    </Space>
  );
};

export default Offset;
