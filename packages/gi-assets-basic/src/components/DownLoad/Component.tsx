import type { IGIAC } from '@antv/gi-sdk';
import { extra } from '@antv/gi-sdk';
import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
const { GIAComponent } = extra;
export interface DownLoad {
  GIAC: IGIAC;
}

const DownLoad: React.FunctionComponent<DownLoad> = props => {
  const { GIAC } = props;
  const { graph } = React.useContext(GraphinContext);
  return <GIAComponent GIAC={GIAC} onClick={() => graph.downloadImage()} />;
};

export default DownLoad;
