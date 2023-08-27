import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext, useShortcuts } from '@antv/gi-sdk';
import React, { memo } from 'react';

const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const ZoomOut: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { apis } = useContext();
  useShortcuts(['ctrl+-', 'command+-'], () => {
    apis.handleZoomIn();
  });
  return <GIAComponent GIAC={GIAC} onClick={() => apis.handleZoomIn()} />;
};

export default memo(ZoomOut);
