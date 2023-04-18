import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import * as React from 'react';
const { GIAComponent } = extra;
export interface DownLoad {
  GIAC: IGIAC;
}

const DownLoad: React.FunctionComponent<DownLoad> = props => {
  const { GIAC } = props;
  const { graph } = useContext();
  return <GIAComponent GIAC={GIAC} onClick={() => graph.downloadImage()} />;
};

export default DownLoad;
