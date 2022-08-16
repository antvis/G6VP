import React from 'react';
import { Button } from 'antd';
import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

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
      <Button
        onClick={toggleVisible}
        type="text"
        icon={visible ? <VerticalLeftOutlined /> : <VerticalRightOutlined />}
        style={{
          position: 'absolute',
          right: 'calc(100% + 2px)',
          boxShadow: '0px 0px 2px 2px rgb(0 0 0 / 10%)',
          backgroundColor: '#fff',
        }}
      />
      {children}
    </div>
  );
};

export default RightContainer;
