import { FieldStringOutlined, NumberOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';
import './index.less';

const { Option, OptGroup } = Select;

export interface GroupSelectProps {
  value?: string;
  onChange?: (color: string) => void;
  schemaData: any;
  mode?: 'multiple' | 'tags' | undefined;
}

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

const GroupSelect: React.FC<GroupSelectProps> = ({ value = [], mode, schemaData, onChange }) => {
  return (
    <div className="group-select-container">
      <Select defaultValue={Array.from(value) as any} style={{ width: 200 }} onChange={onChange} mode={mode}>
        {schemaData.map(d => {
          const properties = d.properties;
          const current: any = [];
          for (const p in properties) {
            current.push({
              key: `${d.nodeType || d.edgeType}^^${p}`,
              value: p,
              type: properties[p],
            });
          }
          return (
            <OptGroup label={d.nodeType || d.edgeType}>
              {current.map(sd => {
                return (
                  <Option value={sd.key}>
                    {iconMap[sd.type]}
                    {sd.value}
                  </Option>
                );
              })}
            </OptGroup>
          );
        })}
      </Select>
    </div>
  );
};

export default GroupSelect;
