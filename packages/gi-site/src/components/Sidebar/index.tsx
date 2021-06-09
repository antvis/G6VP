/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
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

const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { options, value, onChange } = props;

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
    </ul>
  );
};

export default Sidebar;
