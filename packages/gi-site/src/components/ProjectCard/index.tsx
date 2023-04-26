import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Tooltip } from 'antd';
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
  expiredStr?: string;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
  extraTopRight?: React.ReactNode;
}

const ProjectCard: React.FunctionComponent<ProjectCardProps> = props => {
  const {
    cover,
    title,
    description,
    time,
    expiredStr,
    onClick,
    onExportSDK,
    onDownloadProject,
    extra,
    style,
    extraTopRight,
  } = props;
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
          {expiredStr && (
            <div className="expired">
              将于{expiredStr}过期&nbsp;
              <Tooltip title="相关数据已删除，该工作簿即将过期。若需恢复，请在「数据集-回收站」恢复相关数据">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <Divider className="divider" />
      <div className="footer">
        <p className="action" onClick={onClick}>
          进入
        </p>
        {onDownloadProject && (
          <>
            <Divider type="vertical" className="divider-vertical" />
            <p className="action" onClick={onDownloadProject}>
              下载
            </p>
          </>
        )}
        {onExportSDK && (
          <>
            <Divider type="vertical" className="divider-vertical" />
            <p className="action" onClick={onExportSDK}>
              导出 SDK
            </p>
          </>
        )}
        {extra && <div className="extra action"> {extra}</div>}
      </div>
      {extraTopRight && <div className="extra-top-right">{extraTopRight}</div>}
    </div>
  );
};

export default ProjectCard;
