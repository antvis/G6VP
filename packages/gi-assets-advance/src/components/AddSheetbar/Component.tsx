import { extra, IGIAC, useContext } from '@antv/gi-sdk';
import { message } from 'antd';
import React, { memo } from 'react';
import $i18n from '../../i18n';

const { GIAComponent } = extra;
export interface AddSheetbarProps {
  GIAC: IGIAC;
  isRelayout: boolean;
}

const AddSheetbar: React.FunctionComponent<AddSheetbarProps> = props => {
  const { context, graph } = useContext<{
    handleAddSheetbar: (options: any) => void;
  }>();
  const { handleAddSheetbar } = context;
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
      message.warn(
        $i18n.get({
          id: 'advance.components.AddSheetbar.Component.PleaseUseThisFunctionIn',
          dm: '请在默认画布中使用该功能，暂不支持其他画布的「添加页签」功能',
        }),
      );
    }
    handleAddSheetbar &&
      handleAddSheetbar({
        nodes,
        edges,
      });
  }, [graph, handleAddSheetbar, isRelayout]);

  return <GIAComponent GIAC={GIAC} onClick={handleClick} />;
};

export default memo(AddSheetbar);
