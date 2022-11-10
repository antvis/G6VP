import type { IGIAC } from '@antv/gi-sdk';
import { extra } from '@antv/gi-sdk';
import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const FitView: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { graph } = React.useContext(GraphinContext);
  return <GIAComponent GIAC={GIAC} onClick={() => graph.fitView()} />;
};

export default FitView;
