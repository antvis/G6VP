import { GISiteParams } from '@antv/gi-sdk';
import { Select } from 'antd';
import React from 'react';
import Connect from './Connect';
import './index.less';
import LoadGraph from './LoadGraph';

const { Option } = Select;
export interface GraphModelProps {
  onClose: () => void;
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
}
const GraphScopeMode: React.FC<GraphModelProps> = ({ onClose, updateGISite }) => {
  const [state, updateState] = React.useState({
    useToken: localStorage.getItem('TUGRAPH_USER_TOKEN'),
  });
  const { useToken } = state;
  const updateToken = () => {
    updateState(pre => {
      return {
        ...pre,
        useToken: localStorage.getItem('TUGRAPH_USER_TOKEN'),
      };
    });
  };
  return (
    <div>
      <Connect updateToken={updateToken} token={useToken} />
      {useToken && <LoadGraph updateGISite={updateGISite} />}
    </div>
  );
};

export default GraphScopeMode;
