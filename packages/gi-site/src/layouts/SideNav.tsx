import { AppstoreOutlined, DeleteOutlined, GlobalOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import * as React from 'react';
import './index.less';
interface ILayoutProps {}

const DATASET_ITEMS = [
  { label: '新建数据', key: '/dataset/create', icon: <PlusOutlined /> },
  { label: '我的数据', key: '/dataset/list', icon: <MenuUnfoldOutlined /> },
  { label: '案例数据', key: '/dataset/case', icon: <AppstoreOutlined /> },
  { label: '系统直连', key: '/dataset/SYSTEM_DIRECT_CONNECT', icon: <GlobalOutlined /> },
  { label: '回收站', key: '/dataset/delete', icon: <DeleteOutlined /> },
];

const OPEN_ITEMS = [
  { label: '资产管理', key: '/open/assets', icon: <PlusOutlined /> },
  { label: '引擎管理', key: '/open/engines', icon: <MenuUnfoldOutlined /> },
  { label: '用户管理', key: '/open/user', icon: <AppstoreOutlined /> },
];

const WORKBOOK_ITEMS = [
  { label: '我的画布', key: '/workbook/project', icon: <PlusOutlined /> },
  { label: '我的报表', key: '/workbook/report', icon: <MenuUnfoldOutlined /> },
  { label: '分享给我的', key: '/workbook/others', icon: <AppstoreOutlined /> },
  { label: '案例画布', key: '/workbook/case', icon: <AppstoreOutlined /> },
];

const getItems = location => {
  try {
    const module = location.pathname.split('/')[1];
    if (module === 'dataset') {
      return DATASET_ITEMS;
    }
    if (module === 'open') {
      return OPEN_ITEMS;
    }
    if (module === 'workbook') {
      return WORKBOOK_ITEMS;
    }
  } catch (error) {
    return [];
  }
};

const SideNav: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location, history } = props;
  const [state, setState] = React.useState({
    active: location.pathname,
  });
  console.log(location.pathname, location);
  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
    setState({ active: e.key });
    history.push(e.key);
  };

  const items = getItems(location);
  console.log('items', items);
  const { active } = state;
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '240px', paddingRight: '12px' }}>
        <Menu items={items} onClick={onClick} selectedKeys={[active]} />
      </div>
      <div
        style={{
          flex: 1,
          background: 'var(--background-color)',
          padding: '12px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SideNav;
