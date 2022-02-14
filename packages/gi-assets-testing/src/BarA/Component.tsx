import * as React from 'react';

export interface BarA {
  contextmenu: any;
}

const BarA: React.FunctionComponent<BarA> = props => {
  return <div>BarA</div>;
};

export default BarA;
