import { Input, Popover } from 'antd';
import React, { useRef } from 'react';
import { Icon } from '../../Icon';
import IconContent from './IconContent';

import './index.less';
import $i18n from '../../i18n';

export interface IColorInputProps {
  value?: string;
  onChange?: (icon: string) => void;
}

const IconPicker: React.FC<IColorInputProps> = props => {
  const container = useRef<HTMLDivElement>();
  const { value, onChange } = props;

  const [state, setState] = React.useState({
    activeCategory: 'basic',
    activeIcon: value || '',
  });

  const { activeCategory, activeIcon } = state;

  return (
    <div className="icon-input-container">
      <Input
        value={activeIcon}
        onChange={e => {
          setState(preState => {
            return {
              ...preState,
              activeIcon: e.target.value,
            };
          });
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        placeholder={$i18n.get({
          id: 'common-components.CommonStyleSetting.IconPicker.PleaseSelectTheIcon',
          dm: '请选择图标',
        })}
        prefix={
          <Popover
            style={{}}
            placement="topLeft"
            trigger="click"
            overlayInnerStyle={{ padding: 0 }}
            // @ts-ignore
            getPopupContainer={() => container.current}
            content={
              <IconContent
                activeIcon={activeIcon}
                onChange={val => {
                  if (onChange) {
                    onChange(val);
                  }
                }}
                activeCategory={activeCategory}
                updateState={setState}
              />
            }
          >
            <div
              // @ts-ignore
              ref={container}
              className="icon-input-container-icon-tips"
              style={{
                border: `1 solid #ddd`,
              }}
            >
              <Icon type={`icon-${activeIcon}`} style={{ color: '#2f54e0', fontSize: 18, cursor: 'pointer' }}></Icon>
            </div>
          </Popover>
        }
      />
    </div>
  );
};

export default IconPicker;
