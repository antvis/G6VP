import { Container } from '@antv/gi-sdk/lib/hooks/useContainer';
import React, { memo } from 'react';

interface HeaderProps {
  leftArea: Container;
  rightArea: Container;
}

const Header: React.FunctionComponent<HeaderProps> = props => {
  const { leftArea, rightArea } = props;

  return (
    <div className="gi-rich-container-navbar">
      <div className="navbar-back">
        {leftArea.components.map(item => {
          return <item.component key={item.id} {...item.props} />;
        })}
      </div>
      <div className="navbar-setting">
        {rightArea.components.map(item => {
          return <item.component key={item.id} {...item.props} />;
        })}
      </div>
    </div>
  );
};

export default memo(Header);
