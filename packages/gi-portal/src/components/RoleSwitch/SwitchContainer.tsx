import React from 'react';
import { animated, useSpring } from 'react-spring';

const SwitchContainer = (props: any) => {
  const { visible, children } = props;
  let animateStyles = useSpring({
    flex: visible ? 1 : 0,
    width: visible ? '100%' : '0px',
    // backgroundColor: visible ? '#fff' : '#ddd',
    opacity: visible ? 1 : 0,
  });

  return (
    <animated.div
      className="role-container"
      style={{
        overflow: 'hidden',
        height: '100%',
        ...animateStyles,
      }}
    >
      {children}
    </animated.div>
  );
};
export default SwitchContainer;
