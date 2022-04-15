import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import { IGIAC } from '../const';
import GIAComponent from '../GIAC';
export interface IProps {
  GIAC: IGIAC;
}

const ZoomIn: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { apis } = React.useContext(GraphinContext);
  return <GIAComponent GIAC={GIAC} onClick={() => apis.handleZoomOut()} />;
};

export default ZoomIn;