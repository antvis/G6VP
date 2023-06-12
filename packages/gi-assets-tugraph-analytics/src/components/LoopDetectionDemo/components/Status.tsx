import { Badge, Typography } from 'antd';
import React, { memo } from 'react';
import './Status.less';

const { Text } = Typography;

export interface IStatus {
  url: string;
  status: 'waiting' | 'connecting' | 'open' | 'closing' | 'closed' | 'failed';
}

const statusDict: {
  [key in IStatus['status']]: { text: string; color: string };
} = {
  waiting: { text: '等待连接', color: 'gold' },
  connecting: { text: '连接中', color: 'green' },
  open: { text: '已连接', color: 'green' },
  failed: { text: '连接失败', color: 'red' },
  closing: { text: '断开中', color: 'red' },
  closed: { text: '已断开', color: 'red' },
};

export const Status = memo(({ status, url }: IStatus) => {
  const { text, color } = statusDict[status];
  return (
    <div className="status">
      <Text>服务端：{url}</Text>
      <Badge color={color} text={text} className={status} />
    </div>
  );
});
