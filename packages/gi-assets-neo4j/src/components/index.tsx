import { EngineBanner, GISiteParams, utils } from '@antv/gi-sdk';
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
    HAS_CONNECT_SUCCESS: utils.getServerEngineContext()?.HAS_CONNECT_SUCCESS,
  });
  const { HAS_CONNECT_SUCCESS } = state;
  const updateToken = () => {
    updateState(pre => {
      return {
        ...pre,
        HAS_CONNECT_SUCCESS: utils.getServerEngineContext()?.HAS_CONNECT_SUCCESS,
      };
    });
  };

  return (
    <div>
      <EngineBanner
        logo="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*X4I6QZIDjY8AAAAAAAAAAAAADmJ7AQ/original"
        title="NEO4J DATABASE"
        desc="
         Neo4j 拥有超过 950 家企业客户，是全球领先的可扩展图形技术提供商，为超过 75% 的财富 100 强企业提供连接数据应用程序。"
        docs="https://www.yuque.com/antv/gi/otnlbq2dc9q1f8gt"
      />
      <Connect updateToken={updateToken} token={HAS_CONNECT_SUCCESS} />
      {HAS_CONNECT_SUCCESS && <LoadGraph updateGISite={updateGISite} />}
    </div>
  );
};

export default GraphScopeMode;
