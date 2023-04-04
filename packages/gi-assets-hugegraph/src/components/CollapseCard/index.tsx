import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import * as React from 'react';
import './index.less';

const { Panel } = Collapse;

interface CollapseCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  defaultActive?: boolean;
}

const CollapseCard: React.FunctionComponent<CollapseCardProps> = props => {
  const { title, extra, children, defaultActive } = props;
  const defaultActiveKey = defaultActive !== false ? ['card'] : [];
  return (
    <div className="gi-collapse-card">
      <Collapse
        defaultActiveKey={defaultActiveKey}
        collapsible="header"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        bordered={false}
      >
        <Panel key="card" header={title} extra={extra}>
          {children}
        </Panel>
      </Collapse>
    </div>
  );
};

export default CollapseCard;
