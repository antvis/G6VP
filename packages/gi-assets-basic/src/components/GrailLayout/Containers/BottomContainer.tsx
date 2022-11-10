import { Handler } from '@antv/gi-common-components';
import React from 'react';

export interface BottomContainerProps {
  height: string;
  isDisplay: boolean;
  left: string;
  right: string;
  children: any;
  visible: boolean;
  toggleVisible: () => void;
}

const BottomContainer: React.FC<BottomContainerProps> = props => {
  const { children, height, isDisplay, left, right, visible, toggleVisible } = props;

  return (
    <div
      style={{
        height: visible ? height : '0',
        display: isDisplay ? 'flex' : 'none',
        left: left,
        right: right,
        padding: visible ? '10px' : '0',
      }}
      className="gi-grail-layout gi-grail-layout-bottom"
    >
      <Handler type="bottom" handleClick={toggleVisible}></Handler>
      {children}
    </div>
  );
};

export default BottomContainer;
