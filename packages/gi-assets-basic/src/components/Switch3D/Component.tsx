import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';
const { GIAComponent } = extra;

export interface ClearCanvasProps {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: IGIAC;
}

const Switch3D: React.FunctionComponent<ClearCanvasProps> = props => {
  const { GIAC } = props;
  const { graph, context, updateContext } = useContext();

  const handleClick = () => {};

  return <GIAComponent GIAC={GIAC} onClick={handleClick} />;
};

export default memo(Switch3D);
