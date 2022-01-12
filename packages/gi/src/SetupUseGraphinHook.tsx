import { GraphinContext } from '@antv/graphin';
import React from 'react';

const SetupUseGraphinHook = props => {
  const { updateContext } = props;
  const { graph, apis, layout, theme } = React.useContext(GraphinContext);

  React.useEffect(() => {
    updateContext(draft => {
      draft.graph = graph;
      draft.theme = theme;
      draft.apis = apis;
      //@ts-ignore
      draft.layoutInstance = layout;
      draft.isContextReady = true;
    });
  }, []);

  return null;
};

export default SetupUseGraphinHook;
