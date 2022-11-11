import { extra, IGIAC, useContext } from '@alipay/graphinsight';
import { message } from 'antd';
import * as React from 'react';

const { GIAComponent } = extra;
export interface AddSheetbarProps {
  GIAC: IGIAC;
  isRelayout: boolean;
}

const AddSheetbar: React.FunctionComponent<AddSheetbarProps> = props => {
  const { handleAddSheetbar, graph } = useContext();

  const { GIAC, isRelayout } = props;
  const handleClick = React.useCallback(() => {
    const nodes = graph.findAllByState('node', 'selected').map(c => {
      const { x, y, ...otherModel } = c.getModel();
      return isRelayout
        ? otherModel
        : {
            x,
            y,
            ...otherModel,
          };
    });
    const edges = graph.findAllByState('edge', 'selected').map(c => c.getModel());
    if (nodes.length === 0) {
      return;
    }
    if (!handleAddSheetbar) {
      message.warn('请在默认画布中使用该功能，暂不支持其他画布的「添加页签」功能');
    }
    handleAddSheetbar &&
      handleAddSheetbar({
        nodes,
        edges,
      });
  }, [graph, handleAddSheetbar, isRelayout]);

  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={handleClick} />
    </>
  );
};

export default AddSheetbar;
