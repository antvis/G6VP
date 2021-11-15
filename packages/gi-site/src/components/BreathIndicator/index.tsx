import { Popover, Space } from 'antd';
import * as React from 'react';
import './index.less';

interface IBreathIndicatorProps {
  status?: string;
  title?: string;
  children: React.ReactNode;
  content: string;
}

const BreathIndicator: React.FunctionComponent<IBreathIndicatorProps> = props => {
  const { status, title = '小提示', children, content } = props;
  return (
    <Space>
      {children}
      <Popover content={content} title={title} trigger="hover">
        <div className={`status ${status}`} />
      </Popover>
    </Space>
  );
};

export default BreathIndicator;
