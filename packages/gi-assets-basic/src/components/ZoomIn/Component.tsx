import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext, useShortcuts } from '@antv/gi-sdk';
import React, { memo } from 'react';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const ZoomIn: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { apis } = useContext();
  useShortcuts(['ctrl+=', 'command+='], () => {
    apis.handleZoomOut();
  });
  console.log('zoom in....');
  return <GIAComponent GIAC={GIAC} onClick={() => apis.handleZoomOut()} />;
};

export default memo(ZoomIn);
