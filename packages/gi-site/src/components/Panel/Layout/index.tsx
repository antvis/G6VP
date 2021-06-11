import { Collapse } from 'antd';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const { Panel } = Collapse;

interface LayoutPanelProps {}

const LayoutPanel: React.FunctionComponent<LayoutPanelProps> = props => {
  const layout = useSelector(state => state.layout);
  const dispatch = useDispatch();

  const handleChange = value => {
    dispatch({
      type: 'Update_Layout',
      layout: value,
    });
  };
  const { type, options } = layout;

  return <div>Layout</div>;
};

export default LayoutPanel;
