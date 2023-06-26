import { Popover, Space } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';
import './index.less';

interface IBreathIndicatorProps {
  status?: string;
  title?: string;
  children: React.ReactNode;
  content: string;
}

const BreathIndicator: React.FunctionComponent<IBreathIndicatorProps> = props => {
  const {
    status,
    title = $i18n.get({ id: 'gi-site.components.BreathIndicator.Tips', dm: '小提示' }),
    children,
    content,
  } = props;
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
