import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
  React.useEffect(() => {
    if (activeId === 'NEW_GI_SERVICE') {
      handleChange('NEW_GI_SERVICE');
      handleAdd();
    }
  }, [activeId]);

  return (
    <ul className="gi-services-sidebar">
      {options.map(opt => {
        const { id } = opt;
        const isActive = id === activeId;
        const classes = isActive ? 'active' : '';
        const isShowDelete = isActive && id !== options[0].id;
        return (
          <li
            className={classes}
            key={id}
            onClick={() => {
              handleChange(id);
            }}
          >
            {id}

            {isShowDelete && (
              <span
                className="delete"
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
      <li key="plus" onClick={handleAdd} className="plus">
        自定义数据服务 <PlusOutlined />
      </li>
    </ul>
  );
};

export default SideList;
