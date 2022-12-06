import { EditOutlined } from '@ant-design/icons';
import React from 'react';
import { updateProjectById } from '../../services';
import './index.less';

export interface IProjectTitleProps {
  projectId: string;
  name: string;
}

const ProjectTitle: React.FC<IProjectTitleProps> = props => {
  const { projectId, name } = props;
  const [isHover, setIsHover] = React.useState(false);
  const contentEditable = React.createRef<HTMLSpanElement>();

  const changeTitle = async () => {
    const newTitle = contentEditable.current!.innerText;
    updateProjectById(projectId, {
      name: newTitle,
    });
  };
  console.log('name', name);

  const handleKeyDown = e => {
    //禁用回车的默认事件
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  return (
    <span
      className="navbar-title"
      ref={contentEditable}
      contentEditable={true}
      onBlur={changeTitle}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning={true}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {name}
      <EditOutlined style={{ display: isHover ? 'inline-block' : 'none', marginLeft: 5 }} />
    </span>
  );
};

export default ProjectTitle;
