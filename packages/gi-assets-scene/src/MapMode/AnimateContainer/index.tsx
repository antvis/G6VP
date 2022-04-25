import * as React from 'react';
import { animated, useSpring } from 'react-spring';

interface AnimateContainerProps {
  children: React.ReactNode;
  toggle: boolean;
}

const AnimateContainer: React.FunctionComponent<AnimateContainerProps> = props => {
  const { toggle } = props;
  const { size, background, ...otherStyles } = useSpring({
    from: {
      size: '100%',
      background: 'hotpink',
    },
    to: {
      size: toggle ? '20%' : '100%',
      background: toggle ? '#ddd' : 'hotpink',
    },
  });

  return (
    <animated.div
      style={{
        right: '0px',
        bottom: '0px',
        width: size,
        height: size,
        position: 'absolute',
        zIndex: 9,
        ...otherStyles,
      }}
    >
      {props.children}
    </animated.div>
  );
};

export default AnimateContainer;
