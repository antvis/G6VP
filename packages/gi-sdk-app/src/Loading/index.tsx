import * as React from 'react';
import './index.less';
interface LoadingProps {
  title?: string;
}

const Loading: React.FunctionComponent<LoadingProps> = props => {
  const { title } = props;
  return (
    <div className="spinner-box">
      <div className="configure-border-1">
        <div className="configure-core"></div>
      </div>
      <div className="configure-border-2">
        <div className="configure-core"></div>
      </div>
      <div className="loading-text">{title}</div>
    </div>
  );
};

export default Loading;
