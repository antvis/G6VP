import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import { IGIAC } from '../const';
import GIAComponent from '../GIAC';
export interface DownLoad {
  GIAC: IGIAC;
}

const DownLoad: React.FunctionComponent<DownLoad> = props => {
  const { GIAC } = props;
  const { graph } = React.useContext(GraphinContext);
  return <GIAComponent GIAC={GIAC} onClick={() => graph.downloadImage()} />;
};

export default DownLoad;
