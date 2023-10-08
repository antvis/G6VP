import Graphin, { Components, Utils, useGraphin } from '@antv/graphin';
import React from 'react';
const { MiniMap } = Components;
const data = Utils.mock(10).circle().value();

interface ComponentDemosProps {}

const MyComponent = () => {
  const { graph, isReady } = useGraphin();
  const nodeCount = graph.getAllNodesData().length;
  console.log(graph, isReady, nodeCount);
  return <div> My Component,NodeCount: {nodeCount}</div>;
};
const ComponentDemos: React.FunctionComponent<ComponentDemosProps> = props => {
  return (
    <div>
      {/* @ts-ignore */}
      <Graphin data={data} container="graphin-2" style={{ height: '500px' }}>
        <MiniMap />
        <MyComponent />
      </Graphin>
    </div>
  );
};

export default ComponentDemos;
