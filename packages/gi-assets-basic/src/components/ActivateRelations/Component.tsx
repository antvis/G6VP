import { useContext } from '@antv/gi-sdk';
import { Behaviors } from '@antv/graphin';
import React from 'react';

const { ActivateRelations, Hoverable } = Behaviors;

export interface CanvasSettingProps {
  enableNodeHover: boolean;
  enableEdgeHover: boolean;
  enable: boolean;
  trigger: string;
  upstreamDegree: number;
  downstreamDegree: number;
}

const ActivateRelationsAsset: React.FunctionComponent<CanvasSettingProps> = props => {
  const {
    enable,
    trigger,
    //@TODO: 将来加上上下游的度数
    upstreamDegree,
    //@TODO: 将来加上上下游的度数
    downstreamDegree,
    enableEdgeHover,
    enableNodeHover,
  } = props;
  const { persistentHighlight } = useContext();

  return (
    <>
      {enable && !persistentHighlight && <ActivateRelations trigger={trigger} />}
      {enableNodeHover && <Hoverable bindType="node" />}
      {enableEdgeHover && <Hoverable bindType="edge" />}
    </>
  );
};

export default ActivateRelationsAsset;
