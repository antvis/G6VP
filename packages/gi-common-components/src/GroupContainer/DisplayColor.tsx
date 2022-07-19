import { Button } from 'antd';
import React from 'react';

export interface IDisplayColorProps {
  color: string;
}

const DisplayColor: React.FC<IDisplayColorProps> = props => {
  const { color } = props;
  return (
    <Button
      size="small"
      type="text"
      style={{
        width: '24px',
        height: '24px',
        padding: ' 0px 0px',
        fontSize: '14px',
        borderRadius: '2px',
        verticalAlign: '-3px',
      }}
    >
      <div
        style={{
          display: 'block',
          width: '14px',
          height: '14px',
          background: color,
          borderRadius: '50%',
          marginLeft: '3px',
        }}
      ></div>
    </Button>
  );
};

export default DisplayColor;
