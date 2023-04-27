import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, Tooltip } from 'antd';
import React from 'react';
import './index.less';
const { Meta } = Card;

interface ProjectCardProps {
  title: string;
  onClick: () => void;
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

    extra,
    style,
    extraTopRight,
  } = props;
  return (
    <>
      <Card cover={cover} style={{ width: '300px' }}>
        <Meta title={title} description={time} />
        {expiredStr && (
          <div className="expired">
            将于{expiredStr}过期&nbsp;
            <Tooltip title="相关数据已删除，该工作簿即将过期。若需恢复，请在「数据集-回收站」恢复相关数据">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        )}

        {extra && <div style={{ position: 'relative', bottom: '0px', right: '0px' }}> {extra}</div>}
      </Card>
    </>
  );
};

export default ProjectCard;
