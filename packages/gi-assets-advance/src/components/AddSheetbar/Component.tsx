import { extra, IGIAC, useContext } from '@alipay/graphinsight';
import * as React from 'react';

const { GIAComponent } = extra;
export interface AddSheetbarProps {
  GIAC: IGIAC;
}

const AddSheetbar: React.FunctionComponent<AddSheetbarProps> = props => {
  const { handleAddSheetbar, graph } = useContext();

  const { GIAC } = props;
  const handleClick = React.useCallback(() => {
    const nodes = graph.findAllByState('node', 'selected').map(c => c.getModel());
    const edges = graph.findAllByState('edge', 'selected').map(c => c.getModel());
    if (nodes.length === 0) {
      return;
    }
    handleAddSheetbar({
      nodes,
      edges,
    });
  }, [graph, handleAddSheetbar]);

  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={handleClick} />
    </>
  );
};

export default AddSheetbar;
