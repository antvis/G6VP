import {
  AppstoreOutlined,
  BookOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  PlusOutlined,
  RocketOutlined,
} from '@ant-design/icons';

import { Menu, MenuProps } from 'antd';
import * as React from 'react';
import $i18n from '../i18n';
import './index.less';
interface ILayoutProps {}

const DATASET_ITEMS = [
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.MyData', dm: '我的数据' }),
    key: '/dataset/list',
    icon: <MenuUnfoldOutlined />,
  },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.CreateData', dm: '新建数据' }),
    key: '/dataset/create',
    icon: <PlusOutlined />,
  },
  // {
  //   label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.CaseData', dm: '案例数据' }),
  //   key: '/dataset/case',
  //   icon: <AppstoreOutlined />,
  // },
  // {
  //   label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.DirectSystemConnection', dm: '系统直连' }),
  //   key: '/dataset/SYSTEM_DIRECT_CONNECT',
  //   icon: <GlobalOutlined />,
  // },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.RecycleBin', dm: '回收站' }),
    key: '/dataset/delete',
    icon: <DeleteOutlined />,
  },
];

const OPEN_ITEMS = [
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.AssetManagement', dm: '资产管理' }),
    key: '/open/assets-manage',
    icon: <AppstoreOutlined />,
  },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.AssetList', dm: '资产列表' }),
    key: '/open/assets-list',
    icon: <OrderedListOutlined />,
  },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.EngineManagement', dm: '引擎管理' }),
    key: '/open/engines',
    icon: <RocketOutlined />,
  },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.Solution', dm: '解决方案' }),
    key: '/open/solution',
    icon: <BookOutlined />,
  },
  { label: 'V5 DEMO', key: '/open/g6v5demo', icon: <DeploymentUnitOutlined /> },
  // { label: '用户管理', key: '/open/user', icon: <AppstoreOutlined /> },
  // { label: '图应用', key: '/open/portal', icon: <AppstoreOutlined /> },
  // { label: '实验室', key: '/open/lab', icon: <AppstoreOutlined /> },
  // { label: '版本通知', key: '/open/version', icon: <AppstoreOutlined /> },
  // { label: '解决方案', key: '/open/solution', icon: <AppstoreOutlined /> },
];

const WORKBOOK_ITEMS = [
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.MyCanvas', dm: '我的画布' }),
    key: '/workbook/project',
    icon: <GlobalOutlined />,
  },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.CreateACanvas', dm: '新建画布' }),
    key: '/workbook/create',
    icon: <PlusOutlined />,
  },
  {
    label: $i18n.get({ id: 'gi-site.src.layouts.SideNav.MyTemplate', dm: '我的模版' }),
    key: '/workbook/template',
    icon: <AppstoreOutlined />,
  },
  // { label: '我的报表', key: '/workbook/report', icon: <MenuUnfoldOutlined /> },
  // { label: '行业案例', key: '/workbook/case', icon: <AppstoreOutlined /> },
];

const getItems = location => {
  try {
    const module = location.pathname.split('/')[1];
    if (module === 'dataset') {
      return {
        name: $i18n.get({ id: 'gi-site.src.layouts.SideNav.Dataset', dm: '数据集' }),
        items: DATASET_ITEMS,
      };
    }
    if (module === 'open') {
      return {
        name: $i18n.get({ id: 'gi-site.src.layouts.SideNav.OpenMarket', dm: '开放市场' }),
        items: OPEN_ITEMS,
      };
    }
    if (module === 'workbook') {
      return {
        name: $i18n.get({ id: 'gi-site.src.layouts.SideNav.Workbook', dm: '工作簿' }),
        items: WORKBOOK_ITEMS,
      };
    }
    return { items: [], name: $i18n.get({ id: 'gi-site.src.layouts.SideNav.UnknownPage', dm: '未知页面' }) };
  } catch (error) {
    return { items: [], name: $i18n.get({ id: 'gi-site.src.layouts.SideNav.UnknownPage', dm: '未知页面' }) };
  }
};

const SideNav: React.FunctionComponent<ILayoutProps> = props => {
  //@ts-ignore
  const { children, location, history } = props;
  const [state, setState] = React.useState({
    active: location.pathname.split('/').splice(0, 3).join('/'),
  });

  const onClick: MenuProps['onClick'] = e => {
    setState({ active: e.key });
    history.push(e.key);
  };

  const { items, name } = getItems(location);

  const { active } = state;

  return (
    <div style={{ display: 'flex', height: '-webkit-fill-available' }}>
      <div style={{ width: '160px' }}>
        {/* <h2>{name}</h2> */}
        <Menu className="gi-layout__side" items={items} onClick={onClick} selectedKeys={[active]} />
      </div>
      <div
        style={{
          flex: 1,
          // background: 'var(--background-color)',
          padding: '0px 12px',
          width: 'calc(100% - 160px)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SideNav;
