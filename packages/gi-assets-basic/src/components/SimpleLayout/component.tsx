import { useContext } from '@antv/gi-sdk';
import * as React from 'react';
export interface SimpleLayoutProps {}

const SimpleLayout: React.FunctionComponent<SimpleLayoutProps> = props => {
  const { children } = props;
  const context = useContext();
  console.log('context', context);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h1> hello world </h1>
      <div style={{ width: '100%', height: '500px' }}>{children}</div>
    </div>
  );
};

export default SimpleLayout;
