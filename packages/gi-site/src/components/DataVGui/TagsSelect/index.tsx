import { Select } from 'antd';
import React from 'react';
const { Option } = Select;

const TagsSelect = props => {
  const { value, config, onChange } = props;
  const { options } = config;
  const handleChange = e => {
    console.log('handleChange', e);
    onChange(e);
  };
  // const [value, setValue] = React.useState([]);
  console.log('%c props', 'color:red', props);

  return (
    <Select
      mode="tags"
      allowClear
      style={{ width: '100%' }}
      value={value}
      placeholder="请选择字段"
      onChange={handleChange}
    >
      {options.map((c, index) => {
        return (
          <Option key={c.value} value={c.value}>
            {c.label}
          </Option>
        );
      })}
    </Select>
  );
};

export default TagsSelect;
