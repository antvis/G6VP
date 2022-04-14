import { Input, Popover } from 'antd';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import './index.less';

export interface IColorInputProps {
  value?: string;
  onChange?: (color: string) => void;
}

const ColorInput: React.FC<IColorInputProps> = props => {
  let container;
  const [color, setColor] = useState(props.value as string);

  return (
    <div className="color-input-container">
      <Input
        value={props.value}
        onChange={e => {
          setColor(e.target.value);
          props.onChange?.(e.target.value);
        }}
        placeholder="请选择颜色"
        prefix={
          <Popover
            placement="topLeft"
            trigger="click"
            overlayInnerStyle={{ padding: 0 }}
            // @ts-ignore
            getPopupContainer={() => container}
            content={
              <SketchPicker
                color={color}
                onChange={({ rgb }) => {
                  setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`);
                  props.onChange?.(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`);
                }}
              />
            }
          >
            <div
              ref={node => {
                container = node;
              }}
              className="color-input-container-color-tips"
              style={{
                backgroundColor: color,
                border: `1px solid ${color}`,
              }}
            ></div>
          </Popover>
        }
      />
    </div>
  );
};

export default ColorInput;
