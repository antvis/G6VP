import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';

const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const FitView: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { graph } = useContext();

  const callback = () => {
    // graph.fitCenter();
    graph.fitView({
      padding:10,
      rules:{}
    },{
      'duration':200,
    });
  };

  return <GIAComponent GIAC={GIAC} onClick={callback} />;
};

export default memo(FitView);
