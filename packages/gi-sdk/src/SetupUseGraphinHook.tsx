import { GraphinContext } from '@antv/graphin';
import React from 'react';

const SetupUseGraphinHook = props => {
  const { updateContext } = props;
  const { graph, apis, layout, theme } = React.useContext(GraphinContext);

  React.useEffect(() => {
    const stopForceSimulation = () => {
      const { instance } = layout;
      if (instance) {
        const { type, simulation } = instance;
        if (type === 'graphin-force') {
          simulation.stop();
        }
      }
    };
    const restartForceSimulation = (nodes = []) => {
      const { instance } = layout;
      if (instance) {
        const { type, simulation } = instance;
        if (type === 'graphin-force') {
          simulation.restart(nodes, graph);
        }
      }
    };
    console.log('SetupUseGraphinHook', graph && graph.destroyed);
    updateContext(draft => {
      draft.graph = graph;
      draft.theme = theme;
      draft.apis = apis;
      //@ts-ignore
      draft.layoutInstance = layout;
      draft.isContextReady = true;
      draft.stopForceSimulation = stopForceSimulation;
      draft.restartForceSimulation = restartForceSimulation;
    });
    return () => {
      console.warn('卸载组件....', graph && graph.destroyed);
    };
  }, [layout, graph]);

  return null;
};

export default SetupUseGraphinHook;
