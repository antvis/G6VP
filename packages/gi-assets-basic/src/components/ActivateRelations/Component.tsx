import { useContext } from '@antv/gi-sdk';
import { Behaviors } from '@antv/graphin';
import React from 'react';
import ActiveEdge from './ActiveEdge';
import ActivateRelations from './ActivateRelations';

const { Hoverable } = Behaviors;

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
  const { persistentHighlight } = useContext();

  return (
    <>
      {enable && !persistentHighlight && (
        <ActivateRelations
          trigger={trigger}
          upstreamDegree={upstreamDegree}
          downstreamDegree={downstreamDegree}
          multiSelectEnabled={multiSelectEnabled}
          modifierKey={modifierKey}
        />
      )}
      {enableNodeHover && <Hoverable bindType="node" />}
      {enableEdgeHover && <Hoverable bindType="edge" />}
      {enable && !persistentHighlight && <ActiveEdge />}
    </>
  );
};

export default ActivateRelationsAsset;
