import React from 'react';
import './index.less';
import { Input } from './input';
import { MessageList } from './list';

export const Dialog: React.FC = () => {
  return (
    <div className="dialog-content">
      <MessageList />
      <Input />
    </div>
  );
};
