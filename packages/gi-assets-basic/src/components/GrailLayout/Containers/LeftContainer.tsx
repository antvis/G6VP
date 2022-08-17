import React from 'react';
import { Button } from 'antd';
import { VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';

export interface LeftContainerProps {
  width: string;
  isDisplay: boolean;
  children: any;
  toggleVisible: () => void;
  visible: boolean;
}

const handerBackStyles = {
  position: 'absolute',
  left: '100%',
  top: '10%',
  height: '80px',
  width: '38px',
  borderStyle: 'solid',
  borderWidth: '20px',
  borderColor: 'transparent transparent transparent #d9d9d9',
};
const handlerStyles: React.CSSProperties = {
  position: 'absolute',
  left: 'calc(100% - 1px)',
  top: '10%',
  height: '80px',
  width: '38px',
  cursor: 'pointer',
  borderStyle: 'solid',
  borderWidth: '20px',
  borderColor: 'transparent transparent transparent #fafafa',
};
const handlerTextStyles = {
  position: 'absolute',
  left: '-15px',
  top: '8px',
};

const LeftContainer: React.FC<LeftContainerProps> = props => {
  const { children, width, isDisplay, toggleVisible, visible } = props;

  return (
    <div
      style={{ width: visible ? width : '0px', display: isDisplay ? 'flex' : 'none', padding: visible ? '10px' : '0' }}
      className={`gi-grail-layout gi-grail-layout-left`}
    >
      {/* <Button
        onClick={toggleVisible}
        type="text"
        icon={visible ? <VerticalRightOutlined /> : <VerticalLeftOutlined />}
        style={{
          position: 'absolute',
          left: 'calc(100% + 2px)',
          boxShadow: '0px 0px 2px 2px rgb(0 0 0 / 10%)',
          backgroundColor: '#fff',
        }}
      /> */}
     <div style={handerBackStyles as any}></div>
      <div onClick={toggleVisible} style={handlerStyles as any}>
        <span style={handlerTextStyles as any}>||</span>
      </div>
      {children}
    </div>
  );
};

export default LeftContainer;
