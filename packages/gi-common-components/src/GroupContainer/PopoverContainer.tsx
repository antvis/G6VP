import { Popover } from 'antd';
import * as React from 'react';

interface PopoverContainerProps {
  title: string;
  content: React.ReactNode;
  children: React.ReactNode;
}

const PopoverContainer: React.FunctionComponent<PopoverContainerProps> = props => {
  const { title, content, children } = props;
  const [state, setState] = React.useState({
    visible: false,
  });
  const handleClose = () => {
    setState({
      visible: false,
    });
  };
  const handleVisibleChange = value => {
    setState({ visible: value });
  };
  const { visible } = state;
  return (
    <Popover
      placement="bottomRight"
      content={content}
      title={title}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      {children}
    </Popover>
  );
};

export default PopoverContainer;
