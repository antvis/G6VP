import { Icon } from '@antv/gi-sdk';
import { Select } from 'antd';
import * as React from 'react';
import './index.less';
interface AssetsSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    id: string;
    name: string;
    icon?: string;
  }[];
  className?: string;
}

const { Option } = Select;
const AssetsSelect: React.FunctionComponent<AssetsSelectProps> = props => {
  const { value, onChange, options, className } = props;
  return (
    <div>
      <Select onChange={onChange} value={value} className={`style-panel-assets-select ${className}`}>
        {options.map((c: any) => {
          const { id, name, icon, info } = c;
          return (
            <Option value={id} key={id}>
              <div className="style-panel-assets-select-title">
                <div
                  style={{
                    height: '50px',
                    width: '50px',
                    background: '#eaeefc',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    type={info.icon}
                    style={{
                      fontSize: '30px',
                      color: 'var(--primary-color)',
                    }}
                  />
                </div>
                <span
                  style={{
                    marginLeft: '18px',
                  }}
                >
                  {name}
                </span>
              </div>
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default AssetsSelect;
