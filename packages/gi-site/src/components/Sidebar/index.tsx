/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo, useEffect } from 'react';
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

  const nav = location.hash.replace('#', '');

  useEffect(() => {
    if (!nav) return;
    const opt = options.find(opt => opt.id === nav);
    opt && onChange?.(opt);
  }, []);

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
              window.location.hash = `#${id}`;
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

export default memo(Sidebar);
