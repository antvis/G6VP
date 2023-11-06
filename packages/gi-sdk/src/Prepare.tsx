import React, { useEffect } from 'react';
import type { GIConfig } from './typing';
import { registerContext, useContext } from './useContext';

interface PrepareProps {
  config: GIConfig;
  children: React.ReactNode;
}

registerContext({
  pageLayout: {},
  initialized: false,
  prepare: false,
  components: [],
});

const Prepare: React.FunctionComponent<PrepareProps> = props => {
  const { updateContext, context } = useContext();

  const { prepare } = context;
  const { config, children } = props;

  useEffect(() => {
    updateContext(draft => {
      draft.prepare = true;
      draft.nodes = config.nodes;
      draft.edges = config.edges;
      draft.components = config.components;
      draft.pageLayout = config.pageLayout;
      draft.layout = config.layout;
    });
  }, [config]);

  console.log('Prepare....');

  return <>{prepare && children}</>;
};

export default Prepare;
