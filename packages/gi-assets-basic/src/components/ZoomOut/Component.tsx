import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';

import * as React from 'react';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const ZoomOut: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { apis } = useContext();
  return <GIAComponent GIAC={GIAC} onClick={() => apis.handleZoomIn()} />;
};

export default ZoomOut;
