import { GISiteParams } from '@antv/gi-sdk';
import { Select } from 'antd';
import React from 'react';
import Connect from './Connect';
import './index.less';
import LoadGraph from './LoadGraph';

const { Option } = Select;
export interface GraphModelProps {
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
}
const GraphScopeMode: React.FC<GraphModelProps> = ({ updateGISite }) => {
  const [state, updateState] = React.useState({
    connectURI: localStorage.getItem('Neo4j_CONNECT_URI'),
  });
  const { connectURI } = state;
  const updateToken = () => {
    updateState(pre => {
      return {
        ...pre,
        connectURI: localStorage.getItem('Neo4j_CONNECT_URI'),
      };
    });
  };

  return (
    <div>
      <Connect updateToken={updateToken} token={connectURI} />
      {connectURI && <LoadGraph updateGISite={updateGISite} />}
    </div>
  );
};

export default GraphScopeMode;
