import { GISiteParams } from '@antv/gi-sdk';
import { Select, Button } from 'antd';
import React from 'react';
import Connect from './Connect';
import LoadGraph from './LoadGraph';
import './index.less';
import { queryGraphSchema } from '../services/Neo4jService';

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

  const query = async () => {
    const result = await queryGraphSchema();
    console.log(result);
  };

  return (
    <div>
      <Connect updateToken={updateToken} token={connectURI} />
      {connectURI && <LoadGraph updateGISite={updateGISite} />}
      <Button onClick={query}>测试查询</Button>
    </div>
  );
};

export default GraphScopeMode;
