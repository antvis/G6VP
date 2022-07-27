import React from "react";
export const nodeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'nodeType',
    dataIndex: 'nodeType',
    key: 'nodeType',
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
  },
  {
    title: 'source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'target',
    dataIndex: 'target',
    key: 'target',
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
