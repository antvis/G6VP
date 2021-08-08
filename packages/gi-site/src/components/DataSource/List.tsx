import { DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import './index.less';

interface SidebarProps {
  options: any[];
  handleChange: any;
  handleAdd: any;
  handleDelete: any;
  activeId: string;
}

const SideList: React.FunctionComponent<SidebarProps> = props => {
  const { options, handleChange, handleAdd, handleDelete, activeId } = props;

  return (
    <ul className="gi-services-sidebar">
      {options.map(opt => {
        const { id } = opt;
        const isActive = id === activeId;
        const classes = isActive ? 'active' : '';
        return (
          <li
            className={classes}
            key={id}
            onClick={() => {
              handleChange(id);
            }}
          >
            {id}

            {id !== options[0].id && (
              <span
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(id);
                }}
              >
                <DeleteOutlined />
              </span>
            )}
          </li>
        );
      })}
      <li key="plus" onClick={handleAdd}>
        +
      </li>
    </ul>
  );
};

export default SideList;
