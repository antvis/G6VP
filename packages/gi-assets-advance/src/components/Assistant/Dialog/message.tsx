import { useContext } from '@antv/gi-sdk';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Tooltip } from 'antd';
import React from 'react';
import { Message as CMessage } from '../utils/message';

export const Message: React.FC<CMessage> = (props) => {
  const { role, content, timestamp } = props;
  const disablePreview = role === 'user' && !content.includes('`');

  const time = new Date(timestamp).toLocaleString();

  /**
   * markdown 预览工具对于 ``` 语法的支持不够好
   * 为了避免出现预览不正确的情况，这里将 ``` 语法替换为 ```js
   * @param str
   */
  const getLegalContent = (str: string) => {
    // 存在 ```xx 语法，不做处理
    if (str.match(/```[\S]+/g) !== null) return str;
    // 存在 ``` 语法，替换为 ```js
    return str.replace(/```[\s]*\n([\s\S]*?)```/g, '```js\n$1```');
  };

  return (
    <Tooltip title={time} mouseEnterDelay={1}>
      <div>
        {disablePreview ? (
          <div className="message-content">{content}</div>
        ) : (
          <MarkdownPreview
            wrapperElement={{
              'data-color-mode':
                document.documentElement.getAttribute('data-theme') === 'dark'
                  ? 'dark'
                  : 'light',
            }}
            className="message-content"
            source={getLegalContent(content)}
          />
        )}
      </div>
    </Tooltip>
  );
};
