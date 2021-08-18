import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined } from '@ant-design/icons';
import React from 'react';

export const navbarOptions = [
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
