import { Divider } from 'antd';
import React from 'react';
import './index.less';

interface ProjectCardProps {
  title: string;
  onClick: () => void;
  onExportSDK?: (projectItem) => void;
  onDownloadProject?: (projectItem) => void;
  cover: React.ReactNode;
  description?: string;
  time?: any;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  extraTopRight?: React.ReactNode;
}

const ProjectCard: React.FunctionComponent<ProjectCardProps> = props => {
  const { cover, title, description, time, onClick, onExportSDK, onDownloadProject, extra, style, extraTopRight } = props;
  return (
    <div className="project-card" style={style}>
      <div className="content-wrapper">
        <div className="cover" onClick={onClick}>
          {cover}
        </div>
        <div className="content" onClick={onClick}>
          <div className="title">{title}</div>
          {description && <div className="desc">{description}</div>}
          {time && <div className="time"> {time} </div>}
        </div>
      </div>
      <Divider className="divider" />
      <div className="footer">
        <p className="action" onClick={onClick}>进入</p>
        {onDownloadProject && <>
          <Divider type="vertical" className="divider-vertical" />
          <p className="action" onClick={onDownloadProject}>下载</p>
        </>}
        {onExportSDK && <>
          <Divider type="vertical" className="divider-vertical" />
          <p className="action" onClick={onExportSDK}>导出 SDK</p>
        </>}
        {extra && <div className="extra action"> {extra}</div>}
      </div>
      {extraTopRight && <div className="extra-top-right">{extraTopRight}</div>}
    </div>
  );
};

export default ProjectCard;
