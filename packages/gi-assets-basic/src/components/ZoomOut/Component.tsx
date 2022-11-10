import type { IGIAC } from '@antv/gi-sdk';
import { extra } from '@antv/gi-sdk';
import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const ZoomOut: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { apis } = React.useContext(GraphinContext);
  return <GIAComponent GIAC={GIAC} onClick={() => apis.handleZoomIn()} />;
};

export default ZoomOut;
