import React, { useRef, useState } from 'react'
import { Input, Popover } from 'antd'
import { SketchPicker } from 'react-color'
import './index.less'

export interface IColorInputProps {
  value?: string
  onChange?: (color: string) => void
}

const ColorInput: React.FC<IColorInputProps> = (props) => {
  const container = useRef<HTMLDivElement>()
  const [color, setColor] = useState(props.value as string)
  
  return (
    // @ts-ignore
    <div ref={container} className='color-input-container'>
      <Input
        value={props.value}
        onChange={(e) => {
          props.onChange?.(e.target.value)
        }}
        placeholder="请选择颜色"
        prefix={
          <Popover
            autoAdjustOverflow
            trigger="click"
            overlayInnerStyle={{ padding: 0 }}
            // @ts-ignore
            getPopupContainer={() => container.current}
            content={
              <SketchPicker
                color={color}
                onChange={({ rgb }) => {
                  setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`)
                  props.onChange?.(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`)
                }}
              />
            }
          >
            <div
              className='color-input-container-color-tips'
              style={{
                backgroundColor: color,
                border: `1px solid ${color}`
              }}
            ></div>
          </Popover>
        }
      />
    </div>
  )
}

export default ColorInput