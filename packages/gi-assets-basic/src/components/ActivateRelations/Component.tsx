import { registerContext, useContext } from '@antv/gi-sdk';
import { Behaviors } from '@antv/graphin';
import React, { memo } from 'react';

import ActiveEdge from './ActiveEdge';

const { Hoverable, ActivateRelations } = Behaviors;

registerContext({
  persistentHighlight: false,
});

export interface CanvasSettingProps {
  enableNodeHover: boolean;
  enableEdgeHover: boolean;
  enable: boolean;
  trigger: string;
  upstreamDegree: number;
  downstreamDegree: number;
  multiSelectEnabled: boolean;
  modifierKey: string;
}

const ActivateRelationsAsset: React.FunctionComponent<CanvasSettingProps> = props => {
  const {
    enable,
    trigger,
    upstreamDegree,
    downstreamDegree,
    enableEdgeHover,
    enableNodeHover,
    multiSelectEnabled,
    modifierKey,
  } = props;
  const { context } = useContext<{
    persistentHighlight: boolean;
  }>();
  const { persistentHighlight } = context;

  return (
    <>
      {enable && !persistentHighlight && (
        <ActivateRelations
          trigger={trigger}
          // upstreamDegree={upstreamDegree}
          // downstreamDegree={downstreamDegree}
          // multiSelectEnabled={multiSelectEnabled}
          // modifierKey={modifierKey}
        />
      )}
      {enableNodeHover && <Hoverable bindType="node" activateState="hover" />}
      {enableEdgeHover && <Hoverable bindType="edge" activateState="hover" />}
      {enable && !persistentHighlight && <ActiveEdge />}
    </>
  );
};

export default memo(ActivateRelationsAsset);
