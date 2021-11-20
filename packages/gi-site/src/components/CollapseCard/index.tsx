import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import * as React from 'react';
import './index.less';

const { Panel } = Collapse;

interface CollapseCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const CollapseCard: React.FunctionComponent<CollapseCardProps> = props => {
  const { title, extra, children } = props;
  return (
    <div className="gi-collapse-card">
      <Collapse
        defaultActiveKey={['card']}
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
