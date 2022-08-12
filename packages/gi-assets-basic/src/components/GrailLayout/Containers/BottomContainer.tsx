import React from 'react';

export interface BottomContainerProps {
  height: string;
  isDisplay: boolean;
  left: string;
  right: string;
  children: any
}

const BottomContainer: React.FC<BottomContainerProps> = props => {
  const { children, height, isDisplay, left, right } = props;
  return (
    <div
      style={{ height: height, display: isDisplay ? 'flex' : 'none', left: left, right: right }}
      className="graphinsight-grail-layout graphinsight-grail-layout-bottom"
    >
      {children}
    </div>
  );
};

export default BottomContainer;
