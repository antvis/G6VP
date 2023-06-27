import { Badge, Typography } from 'antd';
import React, { memo } from 'react';
import './Status.less';
import $i18n from '../../../i18n';

const { Text } = Typography;

export interface IStatus {
  url: string;
  status: 'waiting' | 'connecting' | 'open' | 'closing' | 'closed' | 'failed';
}

const statusDict: {
  [key in IStatus['status']]: { text: string; color: string };
} = {
  waiting: {
    text: $i18n.get({
      id: 'tugraph-analytics.LoopDetectionDemo.components.Status.WaitingForConnection',
      dm: '等待连接',
    }),
    color: 'gold',
  },
  connecting: {
    text: $i18n.get({ id: 'tugraph-analytics.LoopDetectionDemo.components.Status.Connecting', dm: '连接中' }),
    color: 'green',
  },
  open: {
    text: $i18n.get({ id: 'tugraph-analytics.LoopDetectionDemo.components.Status.Connected', dm: '已连接' }),
    color: 'green',
  },
  failed: {
    text: $i18n.get({ id: 'tugraph-analytics.LoopDetectionDemo.components.Status.ConnectionFailed', dm: '连接失败' }),
    color: 'red',
  },
  closing: {
    text: $i18n.get({ id: 'tugraph-analytics.LoopDetectionDemo.components.Status.Disconnected', dm: '断开中' }),
    color: 'red',
  },
  closed: {
    text: $i18n.get({ id: 'tugraph-analytics.LoopDetectionDemo.components.Status.Disconnected.1', dm: '已断开' }),
    color: 'red',
  },
};

export const Status = memo(({ status, url }: IStatus) => {
  const { text, color } = statusDict[status];
  return (
    <div className="status">
      <Text>
        {$i18n.get(
          {
            id: 'tugraph-analytics.LoopDetectionDemo.components.Status.ServerUrl',
            dm: '服务端：{url}',
          },
          { url: url },
        )}
      </Text>
      <Badge color={color} text={text} className={status} />
    </div>
  );
});
