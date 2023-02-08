import { AppstoreOutlined, DeleteOutlined, GlobalOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import * as React from 'react';
import './index.less';
interface ILayoutProps {}

const SideNav: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location, history } = props;
  const [state, setState] = React.useState({
    active: location.pathname,
  });
  console.log(location.pathname);
  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
    setState({ active: e.key });
    history.push(e.key);
  };
  const items = [
    { label: '新建数据', key: '/dataset/create', icon: <PlusOutlined /> },
    { label: '我的数据', key: '/dataset/list', icon: <MenuUnfoldOutlined /> },
    { label: '案例数据', key: '/dataset/case', icon: <AppstoreOutlined /> },
    { label: '系统直连', key: '/dataset/SYSTEM_DIRECT_CONNECT', icon: <GlobalOutlined /> },
    { label: '回收站', key: '/dataset/delete', icon: <DeleteOutlined /> },
  ];
  const { active } = state;
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px', paddingRight: '12px' }}>
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
