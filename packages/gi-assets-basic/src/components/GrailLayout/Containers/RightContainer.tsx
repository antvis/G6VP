import { Handler } from '@antv/gi-common-components';
import React from 'react';

export interface RightContainerProps {
  width: string;
  isDisplay: boolean;
  children: any;
  visible: boolean;
  toggleVisible: () => void;
}

const RightContainer: React.FC<RightContainerProps> = props => {
  const { children, width, isDisplay, toggleVisible, visible } = props;

  return (
    <div
      style={{ width: visible ? width : '0px', display: isDisplay ? 'flex' : 'none', padding: visible ? '10px' : '0' }}
      className={`gi-grail-layout gi-grail-layout-right`}
    >
      <Handler type="right" handleClick={toggleVisible}></Handler>
      {children}
    </div>
  );
};

export default RightContainer;
