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

  const callback = () => {
    graph.fitCenter(true);
    graph.fitView(20, {}, true, {
      easing: 'easeCubic',
      duration: 300,
    });
  };
  React.useEffect(() => {
    graph.on('canvas:dblclick', callback);
    return () => {
      graph.off('canvas:dblclick', callback);
    };
  }, [graph]);
  return <GIAComponent GIAC={GIAC} onClick={callback} />;
};

export default FitView;
