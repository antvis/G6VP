import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import * as React from 'react';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const FitCenter: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { graph } = useContext();
  return (
    <GIAComponent
      GIAC={GIAC}
      onClick={() => {
        graph.fitCenter(true);
      }}
    />
  );
};

export default FitCenter;
