import React from 'react';

const backStyleMap = {
  left: {
    left: '100%',
    top: '30%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent transparent transparent var(--border-color)',
  },
  right: {
    right: '100%',
    top: '30%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent var(--border-color) transparent transparent',
  },
  bottom: {
    left: '10%',
    bottom: 'calc(100% + 1px)',
    height: '38px',
    width: '80px',
    borderColor: 'transparent transparent var(--border-color) transparent',
  },
};

const handlerStyleMap = {
  left: {
    left: 'calc(100% - 1px)',
    top: '30%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent transparent transparent var(--background-color)',
  },
  right: {
    right: 'calc(100% - 1px)',
    top: '30%',
    height: '80px',
    width: '38px',
    borderColor: 'transparent var(--background-color) transparent transparent ',
  },
  bottom: {
    left: '10%',
    bottom: '100%',
    height: '38px',
    width: '80px',
    borderColor: 'transparent transparent var(--background-color)  transparent',
  },
};

const textStyleMap = {
  left: {
    left: '-15px',
    top: '8px',
  },
  right: {
    left: '5px',
    top: '8px',
  },
  bottom: {
    left: '15px',
    top: '0',
  },
};

export interface HandlerProps {
  handleClick: () => void;
  type: 'left' | 'right' | 'bottom';
}

const Handler: React.FC<HandlerProps> = props => {
  const { handleClick, type } = props;

  const handerBackStyles = {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '20px',
    ...backStyleMap[type],
  };
  const handlerStyles: React.CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '20px',
    ...handlerStyleMap[type],
  };
  const handlerTextStyles = {
    position: 'absolute',
    ...textStyleMap[type],
  };

  return (
    <>
      <div style={handerBackStyles as any}></div>
      <div onClick={handleClick} style={handlerStyles as any}>
        <span style={handlerTextStyles as any}>{type === 'bottom' ? '=' : '||'}</span>
      </div>
    </>
  );
};

export default Handler;
