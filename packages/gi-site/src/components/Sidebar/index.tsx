/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { AppstoreOutlined } from '@ant-design/icons';
import * as React from 'react';
import useAssetsCenter from '../AssetsCenter/useHook';
import { getSearchParams } from '../utils';
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
  collapse?: boolean;
  onChange: (option: Option) => void;
}

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { options, collapse, onChange } = props;
  const { searchParams, path } = getSearchParams(window.location);
  const nav = searchParams.get('nav') || 'style';

  return (
    <ul className="gi-sidebar">
      {options.map(opt => {
        const { icon, id, name } = opt;
        const isActive = id === nav;
        const className = isActive && !collapse ? 'sidebar-item active' : 'sidebar-item';
        return (
          <li
            key={id}
            onClick={() => {
              searchParams.set('nav', id);
              window.location.hash = `${path}?${searchParams.toString()}`;
              onChange(opt);
            }}
            className={`${className} gi-intro-nav-${id}`}
          >
            <span className="icon">{icon}</span>
            <span className="name"> {name}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default Sidebar;
