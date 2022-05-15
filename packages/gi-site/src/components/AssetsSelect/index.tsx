import { Icon } from '@alipay/graphinsight';
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
                <Icon
                  type={info.icon}
                  style={{
                    fontSize: '40px',
                    marginLeft: '18px',
                    verticalAlign: 'bottom',
                    height: '66px',
                    lineHeight: '66px',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    marginLeft: '18px',
                    verticalAlign: 'top',
                    height: '66px',
                    lineHeight: '66px',
                    display: 'inline-block',
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
