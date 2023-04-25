import React, { useContext, useEffect } from 'react';
import { ComponentContext } from '../context';
import { Message } from './message';

export const MessageList: React.FC = () => {
  const { messages } = useContext(ComponentContext);
  const scrollToBottom = () => {
    const list = document.querySelector('.list');
    if (list) {
      list.scrollTo({
        top: list.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="list">
      {messages
        .filter((message) => message.role !== 'system')
        .map((message) => (
          <div key={message.timestamp} className={`message ${message.role}`}>
            <Message {...message} />
          </div>
        ))}
    </div>
  );
};
