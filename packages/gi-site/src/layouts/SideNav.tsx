import { history, useLocation } from 'umi';
import {
  AppstoreOutlined,
  DeleteOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  PlusOutlined,
  RocketOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

import { Menu, MenuProps } from 'antd';
import * as React from 'react';
import { Outlet } from 'umi';
interface ILayoutProps {}

const DATASET_ITEMS = [
  { label: '我的数据', key: '/dataset/list', icon: <MenuUnfoldOutlined /> },
  { label: '新建数据', key: '/dataset/create', icon: <PlusOutlined /> },
  { label: '案例数据', key: '/dataset/case', icon: <AppstoreOutlined /> },
  { label: '系统直连', key: '/dataset/SYSTEM_DIRECT_CONNECT', icon: <GlobalOutlined /> },
  { label: '回收站', key: '/dataset/delete', icon: <DeleteOutlined /> },
];

const OPEN_ITEMS = [
  { label: '资产管理', key: '/open/assets-manage', icon: <AppstoreOutlined /> },
  { label: '资产列表', key: '/open/assets-list', icon: <OrderedListOutlined /> },
  { label: '引擎管理', key: '/open/engines', icon: <RocketOutlined /> },
  { label: 'V5 DEMO', key: '/open/g6v5demo', icon: <DeploymentUnitOutlined /> },
  // { label: '用户管理', key: '/open/user', icon: <AppstoreOutlined /> },
  // { label: '图应用', key: '/open/portal', icon: <AppstoreOutlined /> },
  // { label: '实验室', key: '/open/lab', icon: <AppstoreOutlined /> },
  // { label: '版本通知', key: '/open/version', icon: <AppstoreOutlined /> },
  // { label: '解决方案', key: '/open/solution', icon: <AppstoreOutlined /> },
];

const WORKBOOK_ITEMS = [
  { label: '我的画布', key: '/workbook/project', icon: <GlobalOutlined /> },
  { label: '新建画布', key: '/workbook/create', icon: <PlusOutlined /> },
  { label: '我的模版', key: '/workbook/template', icon: <AppstoreOutlined /> },
  // { label: '我的报表', key: '/workbook/report', icon: <MenuUnfoldOutlined /> },
  // { label: '行业案例', key: '/workbook/case', icon: <AppstoreOutlined /> },
];

const getItems = location => {
  try {
    const module = location.pathname.split('/')[1];
    if (module === 'dataset') {
      return {
        name: '数据集',
        items: DATASET_ITEMS,
      };
    }
    if (module === 'open') {
      return {
        name: '开放市场',
        items: OPEN_ITEMS,
      };
    }
    if (module === 'workbook') {
      return {
        name: '工作薄',
        items: WORKBOOK_ITEMS,
      };
    }
    return { items: [], name: '未知页面' };
  } catch (error) {
    return { items: [], name: '未知页面' };
  }
};

const SideNav: React.FunctionComponent<ILayoutProps> = props => {
  const location = useLocation();
  const [state, setState] = React.useState({
    active: location.pathname.split('/').splice(0, 3).join('/'),
  });

  const onClick: MenuProps['onClick'] = e => {
    setState({ active: e.key });
    history.push(e.key);
  };

  const { items } = getItems(location);

  const { active } = state;

  return (
    <div style={{ display: 'flex', height: '-webkit-fill-available' }}>
      <div style={{ width: '160px' }}>
        <Menu className="gi-layout__side" items={items} onClick={onClick} selectedKeys={[active]} />
      </div>
      <div
        style={{
          flex: 1,
          padding: '0px 12px',
          width: 'calc(100% - 160px)',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default SideNav;
