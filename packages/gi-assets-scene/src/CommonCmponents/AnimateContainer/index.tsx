import { utils } from '@antv/gi-sdk';
import * as React from 'react';
import { animated, useSpring } from 'react-spring';
interface AnimateContainerProps {
  children: React.ReactNode;
  toggle: boolean;
  maxSize: string;
  minSize: string;
  placement: 'LT' | 'RT' | 'LB' | 'RB';
  offset: number[];
}

const AnimateContainer: React.FunctionComponent<AnimateContainerProps> = props => {
  const { toggle, maxSize = '100%', minSize = '20%', placement = 'RB', offset = [8, 8] } = props;
  const { size, background, ...otherStyles } = useSpring({
    from: {
      size: maxSize,
      background: 'hotpink',
    },
    to: {
      size: toggle ? minSize : maxSize,
      background: toggle ? '#ddd' : 'hotpink',
    },
  });
  const positionStyle = utils.getPositionStyles(placement, offset);

  return (
    <animated.div
      style={{
        // right: '10px',
        // bottom: '10px',
        ...positionStyle,
        width: size,
        height: size,
        position: 'absolute',
        zIndex: 9,
        boxShadow: toggle ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
        ...otherStyles,
      }}
    >
      {props.children}
    </animated.div>
  );
};

export default AnimateContainer;
