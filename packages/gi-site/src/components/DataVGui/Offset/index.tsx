import { InputNumber, Space } from 'antd';
import React from 'react';

const Offset = props => {
  const { value, config } = props;
  console.log(props, '@props')
  //const { min, max } = config;

  const [x, y] = value;
  //const [defaultX, defaultY] = config.default;

  return (
    <Space>
      <InputNumber
        size="small"
        //defaultValue={defaultX}
        value={x}
        //min={min}
        //max={max}
        onChange={v => {
          props.onChange([v, y]);
        }}
        placeholder="X轴偏移量"
      />
      <InputNumber
        size="small"
        //defaultValue={defaultY}
        value={y}
        //min={min}
        //max={max}
        onChange={v => {
          props.onChange([x, v]);
        }}
        placeholder="Y轴偏移量"
      />
    </Space>
  );
};

export default Offset;
