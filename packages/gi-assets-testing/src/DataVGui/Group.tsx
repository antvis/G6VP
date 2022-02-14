import { Select } from 'antd';
import React from 'react';
const { Option } = Select;

const Group = props => {
  const { value, config, onChange } = props;
  const { options } = config;
  const handleChange = e => {
    console.log('handleChange', e);
    onChange(e);
  };
  // const [value, setValue] = React.useState([]);
  console.log('%c props', 'color:red', props);

  return <div className="test-group"></div>;
};

export default Group;
