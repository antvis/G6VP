import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined, DatabaseOutlined } from '@ant-design/icons';
import React from 'react';

export const navbarOptions = [
  {
    id: 'data',
    name: '数据',
    icon: <DatabaseOutlined />,
  }, 
  {
    id: 'style',
    name: '样式',
    icon: <BgColorsOutlined />,
  },
  {
    id: 'layout',
    name: '布局',
    icon: <BranchesOutlined />,
  },
  {
    id: 'components',
    name: '组件',
    icon: <AppstoreOutlined />,
  },
];
