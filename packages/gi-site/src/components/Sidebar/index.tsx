/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { AppstoreOutlined } from '@ant-design/icons';
import * as React from 'react';
import useAssetsCenter from '../AssetsCenter/useHook';
import './index.less';
interface Option {
  /** 导航图标 */
  icon: React.ReactElement;
  /** 导航ID */
  id: string;
  /** 导航名称 */
  name: string;
}
interface SidebarProps {
  options: Option[];
  value: Option['id'];
  onChange: (option: Option) => void;
}

const Extra = () => {
  const { handleOpenAssetsCenter } = useAssetsCenter('components');

  const options = [
    {
      id: 'assets',
      name: '资产',
      icon: <AppstoreOutlined />,
      action: handleOpenAssetsCenter,
    },
  ];
  return (
    <>
      {options.map(c => {
        return (
          <li className="sidebar-item assets-center" key={c.id} onClick={c.action}>
            <span className="icon">{c.icon}</span>
            <span className="name"> {c.name}</span>
          </li>
        );
      })}
    </>
  );
};

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { options, value, onChange } = props;
  const url = new URL(window.location.href);
  console.log('url', url);

  return (
    <ul className="gi-sidebar">
      {options.map(opt => {
        const { icon, id, name } = opt;
        const isActive = id === value;
        const className = isActive ? 'sidebar-item active' : 'sidebar-item';
        const buttonType = isActive ? 'primary' : 'default';

        return (
          <li
            key={id}
            onClick={() => {
              onChange(opt);
            }}
            className={className}
          >
            <span className="icon">{icon}</span>
            <span className="name"> {name}</span>
          </li>
        );
      })}
      <Extra />
    </ul>
  );
};

export default Sidebar;
