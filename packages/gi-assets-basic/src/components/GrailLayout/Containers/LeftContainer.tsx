import React from 'react';
import { Button } from 'antd';
import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

export interface LeftContainerProps {
  width: string;
  isDisplay: boolean;
  children: any;
  toggleVisible: () => void
  visible: boolean
}

const LeftContainer: React.FC<LeftContainerProps> = props => {
  const { children, width, isDisplay, toggleVisible, visible } = props;

  return (
    <div
      style={{ width: visible ? width : '0px', display: isDisplay ? 'flex' : 'none' }}
      className={`graphinsight-grail-layout graphinsight-grail-layout-left`}
    >
      <Button
        onClick={toggleVisible}
        type="text"
        icon={visible ? <VerticalRightOutlined /> : <VerticalLeftOutlined />}
        style={{
          position: 'absolute',
          left: '100%',
        }}
      />
      {children}
    </div>
  );
};

export default LeftContainer;