import * as React from 'react';
import './index.less';

export interface TimelineProps {
  visible: boolean;
  handleClose: () => void;
  style: React.CSSProperties;
}

const Timeline: React.FunctionComponent<TimelineProps> = props => {
  const { handleClose, style } = props;

  return (
    <div
      style={{
        background: 'red',
        height: '500px',
        width: '500px',
        ...style,
      }}
    >
      HELLO TIMELINE
      <button onClick={handleClose}> close</button>
    </div>
  );
};

export default Timeline;
