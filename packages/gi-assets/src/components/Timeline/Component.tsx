import * as React from 'react';
import './index.less';

export interface TimelineProps {
  visible: boolean;
  style: React.CSSProperties;
}

const Timeline: React.FunctionComponent<TimelineProps> = props => {
  const { style } = props;

  return (
    <div
      style={
        {
          background: 'red',
          height: '500px',
          width: '500px',
          ...style,
        } as any
      }
    >
      HELLO TIMELINE
    </div>
  );
};

export default Timeline;
