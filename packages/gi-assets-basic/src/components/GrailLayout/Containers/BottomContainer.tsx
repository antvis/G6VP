import React from 'react';
import { useImmer } from 'use-immer';
import { Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export interface BottomContainerProps {
  height: string;
  isDisplay: boolean;
  left: string;
  right: string;
  children: any;
  visible: boolean;
  toggleVisible: () => void;
}

const handerBackStyles = {
  position: 'absolute',
  left: '10%',
  bottom: 'calc(100% + 1px)',
  height: '38px',
  width: '80px',
  borderStyle: 'solid',
  borderWidth: '20px',
  borderColor: 'transparent transparent #d9d9d9 transparent',
};
const handlerStyles: React.CSSProperties = {
  position: 'absolute',
  left: '10%',
  bottom: '100%',
  height: '38px',
  width: '80px',
  cursor: 'pointer',
  borderStyle: 'solid',
  borderWidth: '20px',
  borderColor: 'transparent transparent #fafafa  transparent',
};
const handlerTextStyles = {
  position: 'absolute',
  left: '15px',
  top: '0',
};

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
      <div style={handerBackStyles as any}></div>
      <div onClick={toggleVisible} style={handlerStyles as any}>
        <span style={handlerTextStyles as any}>=</span>
      </div>
      {/* <Button
        onClick={toggleVisible}
        style={{
          position: 'absolute',
          bottom: 'calc(100% + 2px)',
          boxShadow: '0px 0px 2px 2px rgb(0 0 0 / 10%)',
          backgroundColor: '#fff',
        }}
        icon={visible ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        type="text"
      /> */}
      {children}
    </div>
  );
};

export default BottomContainer;
