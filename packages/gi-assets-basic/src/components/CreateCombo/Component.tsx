import { useContext } from '@alipay/graphinsight';
import { Behaviors } from '@antv/graphin';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import type { IGIAC } from '@alipay/graphinsight';
import { extra } from '@alipay/graphinsight';
const { GIAComponent } = extra;
const { BrushSelect, DragCanvas } = Behaviors;

export interface CreateComboType {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: IGIAC;
}

const CreateCombo: React.FunctionComponent<CreateComboType> = props => {
  const { GIAC } = props;

  const { graph, GISDK_ID } = useContext();

  const handleCreateCombo = () => {
    graph.createCombo({
      id: Math.random().toString(36).slice(-6),
      style: {
        stroke: 'blue',
        lineWidth: 2
      }
    }, [])
  };

  return (
    <GIAComponent onClick={handleCreateCombo} GIAC={GIAC} />
  );
};

export default CreateCombo;
