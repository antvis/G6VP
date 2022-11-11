import { useContext } from '@antv/gi-sdk';
import React from 'react';

/**
 *
 * @returns 点击Canvas的交互逻辑
 */
const CanvasClick = () => {
  const { graph } = useContext();

  React.useEffect(() => {
    const handleCenter = () => {
      graph.fitCenter(); // graph.fitCenter(true); 动画有bug
    };
    graph.on('canvas:dblclick', handleCenter);
    return () => {
      graph.off('canvas:dblclick', handleCenter);
    };
  }, [graph]);
  return null;
};

export default CanvasClick;
