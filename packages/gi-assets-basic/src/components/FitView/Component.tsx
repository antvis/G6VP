import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import { IGIAC } from '../const';
import GIAComponent from '../GIAC';
export interface IProps {
  GIAC: IGIAC;
}

const FitView: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { graph } = React.useContext(GraphinContext);
  return <GIAComponent GIAC={GIAC} onClick={() => graph.fitView()} />;
};

export default FitView;
