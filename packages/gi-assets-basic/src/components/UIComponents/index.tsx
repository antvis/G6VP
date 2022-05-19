import * as React from 'react';

interface DrawerProps {
  style: React.CSSProperties;
  visible: boolean;
}
const defaultStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  bottom: '0px',
  left: 0,
};

const Drawer: React.FunctionComponent<DrawerProps> = props => {
  const { visible, style } = props;
  return <div style={{ ...defaultStyles, ...style }}></div>;
};

export default Drawer;
