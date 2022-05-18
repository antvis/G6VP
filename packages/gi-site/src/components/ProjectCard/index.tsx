import * as React from 'react';
import './index.less';
interface ProjectCardProps {
  title: string;
  description: string;
  onClick: () => void;
  cover: React.ReactNode;
  time: any;
}

const ProjectCard: React.FunctionComponent<ProjectCardProps> = props => {
  const { cover, title, description, time, onClick } = props;
  return (
    <div className="project-card" onClick={onClick}>
      <div className="cover">{cover}</div>
      <div className="content">
        <div className="title">{title}</div>
        <div className="desc">{description}</div>
        <div className="time"> {time}</div>
      </div>
    </div>
  );
};

export default ProjectCard;
