import { InputNumber, Space } from 'antd';
import React from 'react';
import $i18n from '../../i18n';

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
          //@ts-ignore
          props.onChange([v, y]);
        }}
        placeholder={$i18n.get({ id: 'common-components.FormilyForm.Offset.XAxisOffset', dm: 'X轴偏移量' })}
      />

      <InputNumber
        size="small"
        //defaultValue={defaultY}
        value={y}
        min={min}
        max={max}
        onChange={v => {
          //@ts-ignore
          props.onChange([x, v]);
        }}
        placeholder={$i18n.get({ id: 'common-components.FormilyForm.Offset.YAxisOffset', dm: 'Y轴偏移量' })}
      />
    </Space>
  );
};

export default Offset;
