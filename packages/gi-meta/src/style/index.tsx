import GUI from '@ali/react-datav-gui';
import { Select } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

const defaultOptions = [
  {
    id: 'graphin-node',
    name: '官方内置节点',
    props: {},
    meta: {},
  },
  {
    name: '第三刚节点',
    id: 'custom-node',
    props: {},
  },
];

interface StylePanelProps {}

const StylePanel: React.FunctionComponent<StylePanelProps> = props => {
  console.log('props', props);
  const [state, setState] = useState({
    options: defaultOptions,
    currentId: 'graphin-node',
  });
  const configObj = { useGUI: { name: '使用GUI', type: 'switch' } };
  const valueObj = { useGUI: true };

  const handleChange = value => {
    console.log(`selected ${value}`);
    setState(preState => {
      return {
        ...preState,
        currentId: value,
      };
    });
  };

  const { options, currentId } = state;
  console.log('currentId', currentId);
  return (
    <div>
      <h1>Node</h1>
      <Select onChange={handleChange} value={currentId}>
        {options.map(c => {
          return (
            <Option value={c.id} key={c.id}>
              {c.name}
            </Option>
          );
        })}
      </Select>
      <GUI configObj={configObj} valueObj={valueObj} />
    </div>
  );
};

export default StylePanel;
