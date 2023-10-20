import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';
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
        graph.fitCenter({
          'duration':100,
        });
      }}
    />
  );
};

export default memo(FitCenter);
