import React from 'react';
import { Handler } from '@alipay/gi-common-components';

export interface LeftContainerProps {
  width: string;
  isDisplay: boolean;
  children: any;
  toggleVisible: () => void;
  visible: boolean;
}

const LeftContainer: React.FC<LeftContainerProps> = props => {
  const { children, width, isDisplay, toggleVisible, visible } = props;

  return (
    <div
      style={{ width: visible ? width : '0px', display: isDisplay ? 'flex' : 'none', padding: visible ? '10px' : '0' }}
      className={`gi-grail-layout gi-grail-layout-left`}
    >
      <Handler type="left" handleClick={toggleVisible} />
      {children}
    </div>
  );
};

export default LeftContainer;
