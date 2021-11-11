import * as React from 'react';
import './index.less';
interface ActionListProps {
  title: string;
  extra: React.ReactNode;
}

const ActionList: React.FunctionComponent<ActionListProps> = props => {
  const { title, extra } = props;
  return (
    <div className="gi-action-list">
      <div className="list-title">{title}</div>
      <div className="list-extra">{extra}</div>
    </div>
  );
};

export default ActionList;
