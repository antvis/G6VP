import React from 'react';
import { useContext } from '../Context';
const FitCenterAfterMount = () => {
  const { graph, context } = useContext();
  const { layout } = context;
  let timer;
  React.useEffect(() => {
    const { type } = layout.props;
    if (type === 'graphin-force' || type === 'force') {
      return;
    }
    if (type === 'dagre') {
      timer = setTimeout(() => {
        // graph.fitCenter(true);
      }, 200);
    } else {
      // graph.fitCenter(true);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);
  return null;
};
export default FitCenterAfterMount;
