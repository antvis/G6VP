import React from 'react';
import { useContext } from '../context';
const FitCenterAfterMount = () => {
  const { graph, layout } = useContext();
  let timer;
  React.useEffect(() => {
    const { type } = layout;
    if (type === 'graphin-force' || type === 'force2') {
      return;
    }
    if (type === 'dagre') {
      timer = setTimeout(() => {
        graph.fitCenter(true);
      }, 200);
    } else {
      graph.fitCenter(true);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);
  return null;
};
export default FitCenterAfterMount;
