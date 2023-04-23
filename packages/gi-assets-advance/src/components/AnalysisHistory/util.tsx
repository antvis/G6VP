import * as React from 'react';
import { Col, Popover, Row, Tooltip } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

const ColorTag = {
  query: '#096dd9',
  analyse: '#faad14',
};

const Label = {
  query: '查询',
  analyse: '分析',
};

export const getRecordsFromHistory = (history, urlMap = {}) => {
  if (!history) return [];
  const items: React.ReactElement[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const { id } = history[i];
    items.push(getRecordContent(history[i], urlMap[id]));
  }
  return items;
};

export const getRecordContent = (item, url): React.ReactElement => {
  const { type, language, statement, timestamp } = item;
  const date = new Date(timestamp);
  return (
    <div style={{ width: '100%', display: 'inline-flex' }}>
      <div className="gi-analysis-history-tag" style={{ background: ColorTag[type] }} />
      <div style={{ color: ColorTag[type] }}>{Label[type]}</div>
      <span className="gi-analysis-history-statement">
        {Label[type]} ({language}): {statement}
      </span>
      <span className="gi-analysis-history-time">
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </span>
      {url ? (
        <Popover
          placement="top"
          style={{ width: 'fit-content', height: 'fit-content' }}
          content={<img src={url} style={{ width: '300px' }} />}
        >
          <PictureOutlined className="gi-analysis-history-screenshot-icon" />
        </Popover>
      ) : (
        ''
      )}
    </div>
  );
};
