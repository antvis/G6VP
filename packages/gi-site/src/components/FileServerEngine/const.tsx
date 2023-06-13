import { Tooltip } from 'antd';
import React from 'react';
export const nodeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    width: 250,
    render: id => (
      <Tooltip placement="topLeft" title={id}>
        {id}
      </Tooltip>
    ),
  },
  {
    title: 'nodeType',
    dataIndex: 'nodeType',
    key: 'nodeType',
    width: 150,
    ellipsis: true,
    render: nodeType => (
      <Tooltip placement="topLeft" title={nodeType}>
        {nodeType}
      </Tooltip>
    ),
  },
  {
    title: 'data',
    dataIndex: 'data',
    key: 'data',
    render: data => <span>{JSON.stringify(data)}</span>,
  },
];

export const edgeColumns = [
  {
    title: 'edgeType',
    dataIndex: 'edgeType',
    key: 'edgeType',
    width: 150,
    ellipsis: true,
    render: edgeType => (
      <Tooltip placement="topLeft" title={edgeType}>
        {edgeType}
      </Tooltip>
    ),
  },
  {
    title: 'source',
    dataIndex: 'source',
    key: 'source',
    ellipsis: true,
    width: 250,
    render: source => (
      <Tooltip placement="topLeft" title={source}>
        {source}
      </Tooltip>
    ),
  },
  {
    title: 'target',
    dataIndex: 'target',
    key: 'target',
    width: 250,
    ellipsis: true,
    render: target => (
      <Tooltip placement="topLeft" title={target}>
        {target}
      </Tooltip>
    ),
  },
  {
    title: 'data',
    dataIndex: 'data',
    key: 'data',
    render: data => <span>{JSON.stringify(data)}</span>,
  },
];

export const translist = [
  {
    key: 'edit',
    id: 'id',
    source: 'source',
    target: 'target',
  },
];
