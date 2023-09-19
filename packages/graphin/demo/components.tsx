import Graphin, { Components, Utils } from '@antv/graphin';
import * as React from 'react';
const { MiniMap } = Components;
const data = Utils.mock(10).circle().value();

console.log('data', data);

interface ComponentDemosProps {}

const ComponentDemos: React.FunctionComponent<ComponentDemosProps> = props => {
  return (
    <div>
      {/* @ts-ignore  */}
      <Graphin data={data} style={{ height: '500px' }}>
        <MiniMap />
      </Graphin>
    </div>
  );
};

export default ComponentDemos;
