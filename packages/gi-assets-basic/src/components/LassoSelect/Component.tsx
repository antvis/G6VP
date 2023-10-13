import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import { Behaviors } from '@antv/graphin';
import React, { memo } from 'react';
const { GIAComponent } = extra;

export interface LassoType {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: IGIAC;
}

const LassoSelect: React.FunctionComponent<LassoType> = props => {
  const { GIAC } = props;
  const [isLasso, setIsLasso] = React.useState(false);
  const { graph, GISDK_ID } = useContext();

  const handleLasso = () => {
    const mode = !isLasso ? 'lasso' : 'default';
    graph.setMode(mode);
    setIsLasso(!isLasso);

    // // @ts-ignore
    // container.style.opacity = isLasso ? 1 : 0.8;
  };

  return (
    <div>
      <GIAComponent onClick={handleLasso} GIAC={GIAC} />
      <Behaviors.LassoSelect />
    </div>
  );
};

export default memo(LassoSelect);
