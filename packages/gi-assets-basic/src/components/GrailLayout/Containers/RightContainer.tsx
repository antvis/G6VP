import React from 'react';
import { Button } from 'antd';
import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

export interface RightContainerProps {
  width: string;
  isDisplay: boolean;
  children: any;
  visible: boolean;
  toggleVisible: () => void
}

const RightContainer: React.FC<RightContainerProps> = props => {
  const { children, width, isDisplay, toggleVisible, visible } = props;

  return (
    <div
      style={{ width: visible ? width : '0px', display: isDisplay ? 'flex' : 'none' }}
      className={`graphinsight-grail-layout graphinsight-grail-layout-right`}
    >
      <Button
        onClick={toggleVisible}
        type="text"
        icon={visible ? <VerticalLeftOutlined /> : <VerticalRightOutlined />}
        style={{
          position: 'absolute',
          right: '100%',
        }}
      />
      {children}
    </div>
  );
};

export default RightContainer;