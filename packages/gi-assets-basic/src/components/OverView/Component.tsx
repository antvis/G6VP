import { useContext } from '@alipay/graphinsight';
import * as React from 'react';
import FilterPanel from './Filter';
import './index.less';

export interface LoadingProps {
  limit: number;
}

const Overview: React.FunctionComponent<LoadingProps> = props => {
  const { limit } = props;
  const context = useContext();
  const [state, setState] = React.useState({
    visible: false,
  });

  const { largeGraphMode, source, data } = context;
  console.log('largeGraphMode', limit);
  const { visible } = state;
  React.useEffect(() => {
    setState(pre => {
      return {
        ...pre,
        visible: largeGraphMode,
      };
    });
  }, [largeGraphMode]);

  return (
    <div>
      当前节点{source.nodes.length} 边{source.edges.length}
      <FilterPanel histogramColor="#3056E3" isFilterIsolatedNodes={true} highlightMode={true} limit={limit} />
    </div>
  );
};

export default Overview;
