import React from 'react';
import './index.less';

interface ProjectCardProps {
  title: string;
  onClick: () => void;
  cover: React.ReactNode;
  description?: string;
  time?: any;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  extraTopRight?: React.ReactNode;
}

const ProjectCard: React.FunctionComponent<ProjectCardProps> = props => {
  const { cover, title, description, time, onClick, extra, style, extraTopRight } = props;
  return (
    <div className="project-card" style={style}>
      <div className="cover" onClick={onClick}>
        {cover}
      </div>
      <div className="content" onClick={onClick}>
        <div className="title">{title}</div>
        {description && <div className="desc">{description}</div>}
        {time && <div className="time"> {time} </div>}
      </div>
      {extra && <div className="extra"> {extra}</div>}
      {extraTopRight && <div className="extra-top-right">{extraTopRight}</div>}
    </div>
  );
};

export default ProjectCard;
