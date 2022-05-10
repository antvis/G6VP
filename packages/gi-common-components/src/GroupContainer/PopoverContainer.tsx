import { Popover } from 'antd';
import * as React from 'react';

interface PopoverContainerProps {
  title: string;
  content: React.ReactNode;
  children: React.ReactNode;
  disabled: boolean;
}

const PopoverContainer: React.FunctionComponent<PopoverContainerProps> = props => {
  const { title, content, disabled, children } = props;
  const [state, setState] = React.useState({
    visible: false,
  });

  const handleVisibleChange = value => {
    setState({ visible: value });
  };
  const { visible } = state;

  if (disabled) {
    return children;
  }

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
