import Graphin, { Components, GraphinContext, Utils, useGraphin } from '@antv/graphin';
import React from 'react';
const { MiniMap } = Components;
const data = Utils.mock(10).circle().value();

console.log('data', data);

interface ComponentDemosProps {}

const MyComponent = () => {
  const { graph, isReady } = useGraphin();
  console.log(graph, isReady);
  return <div> My Component</div>;
};
const OutSideComponent = () => {
  const { graph, isReady } = useGraphin();
  console.log(graph, isReady);
  return <div> OutSide Component</div>;
};

const ComponentDemos: React.FunctionComponent<ComponentDemosProps> = props => {
  const [state, setState] = React.useState({ graph: null, isReady: false });
  const handleInit = graph => {
    setState(pre => {
      return {
        ...pre,
        graph,
        isReady: true,
      };
    });
  };
  console.log('state.isReady', state.isReady);
  return (
    <GraphinContext.Provider value={state}>
      {/* @ts-ignore  */}
      <Graphin data={data} container="graphin-2" style={{ height: '500px', flex: 1 }} onInit={handleInit}>
        <MiniMap />
        <MyComponent />
      </Graphin>
      {state.isReady && <OutSideComponent />}
    </GraphinContext.Provider>
  );
};

export default ComponentDemos;
