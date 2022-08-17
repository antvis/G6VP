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

const handerBackStyles = {
  position: 'absolute',
  right: '100%',
  top: '10%',
  height: '80px',
  width: '38px',
  borderStyle: 'solid',
  borderWidth: '20px',
  borderColor: 'transparent #d9d9d9 transparent transparent',
};
const handlerStyles: React.CSSProperties = {
  position: 'absolute',
  right: 'calc(100% - 1px)',
  top: '10%',
  height: '80px',
  width: '38px',
  cursor: 'pointer',
  borderStyle: 'solid',
  borderWidth: '20px',
  borderColor: 'transparent #fafafa transparent transparent ',
};
const handlerTextStyles = {
  position: 'absolute',
  left: '5px',
  top: '8px',
};

const RightContainer: React.FC<RightContainerProps> = props => {
  const { children, width, isDisplay, toggleVisible, visible } = props;

  return (
    <div
      style={{ width: visible ? width : '0px', display: isDisplay ? 'flex' : 'none', padding: visible ? '10px' : '0' }}
      className={`gi-grail-layout gi-grail-layout-right`}
    >
      {/* <Button
        onClick={toggleVisible}
        type="text"
        icon={visible ? <VerticalLeftOutlined /> : <VerticalRightOutlined />}
        style={{
          position: 'absolute',
          right: 'calc(100% + 2px)',
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

export default RightContainer;
