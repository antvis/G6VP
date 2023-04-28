import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';

import * as React from 'react';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const FitView: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { graph } = useContext();
  return (
    <GIAComponent
      GIAC={GIAC}
      onClick={() => {
        graph.fitView(20, {}, true, {
          easing: 'easeCubic',
          duration: 200,
        });
      }}
    />
  );
};

export default FitView;
