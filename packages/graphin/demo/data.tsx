import Graphin, { Utils } from '@antv/graphin';
import * as React from 'react';

const data = Utils.mock(10).circle().value();
console.log('data', data);

const DataDemo = props => {
  return <Graphin data={data} layout={{ type: 'force' }} style={{ height: '700px' }} />;
};

export default DataDemo;
