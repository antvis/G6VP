import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined } from '@ant-design/icons';
import React from 'react';
import $i18n from '../../i18n';

export const navbarOptions = [
  // {
  //   id: 'data',
  //   name: '数据',
  //   icon: <DatabaseOutlined />,
  // },
  {
    id: 'style',
    name: $i18n.get({ id: 'gi-site.pages.Analysis.Constants.Style', dm: '样式' }),
    icon: <BgColorsOutlined />,
  },
  {
    id: 'layout',
    name: $i18n.get({ id: 'gi-site.pages.Analysis.Constants.Layout', dm: '布局' }),
    icon: <BranchesOutlined />,
  },
  {
    id: 'components',
    name: $i18n.get({ id: 'gi-site.pages.Analysis.Constants.Component', dm: '组件' }),
    icon: <AppstoreOutlined />,
  },
];
