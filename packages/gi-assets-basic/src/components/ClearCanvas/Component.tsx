import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import * as React from 'react';

const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const ClearCanvas: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  const { graph, updateContext } = useContext();
  const handleClick = React.useCallback(() => {
    graph.clear();
    graph.fitCenter();
    updateContext(draft => {
      draft.source = { nodes: [], edges: [] };
      draft.data = { nodes: [], edges: [] };
    });
  }, [graph, updateContext]);
  return <GIAComponent GIAC={GIAC} onClick={handleClick} />;
};

export default ClearCanvas;
