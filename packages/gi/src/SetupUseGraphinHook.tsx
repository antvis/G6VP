import { GraphinContext } from '@antv/graphin';
import React from 'react';

const SetupUseGraphinHook = props => {
  const { updateContext } = props;
  const { graph, apis, layout, theme } = React.useContext(GraphinContext);

  React.useEffect(
    () => {
      console.log('set up graphin effect');
      updateContext(draft => {
        draft.graph = graph;
        draft.theme = theme;
        draft.apis = apis;
        //@ts-ignore
        draft.layoutInstance = layout;
        draft.isContextReady = true;
      });
    },
    [
      // graph, apis, layout, theme, updateContext
    ],
  );

  return null;
};

export default SetupUseGraphinHook;
