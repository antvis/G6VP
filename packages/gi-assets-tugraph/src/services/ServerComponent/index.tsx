import { EngineBanner, GISiteParams, utils } from '@antv/gi-sdk';
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
    useToken: utils.getServerEngineContext()?.TUGRAPH_USER_TOKEN,
  });
  const { useToken } = state;
  const updateToken = () => {
    updateState(pre => {
      return {
        ...pre,
        useToken: utils.getServerEngineContext()?.TUGRAPH_USER_TOKEN,
      };
    });
  };
  return (
    <div>
      <EngineBanner
        docs="https://www.yuque.com/antv/gi/wuvtyf"
        title="高性能图数据库"
        desc="TuGraph 是蚂蚁集团自主研发的大规模图计算系统，提供图数据库引擎和图分析引擎。其主要特点是大数据量存储和计算，高吞吐率，以及灵活的 API，同时支持高效的在线事务处理（OLTP）和在线分析处理（OLAP）"
        logo="https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ"
      />
      <Connect updateToken={updateToken} token={useToken} />
      {useToken && <LoadGraph updateGISite={updateGISite} />}
    </div>
  );
};

export default GraphScopeMode;
