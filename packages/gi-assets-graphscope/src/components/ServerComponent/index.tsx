import { EngineBanner, GISiteParams, utils } from '@antv/gi-sdk';
import React from 'react';
import Connect from './Connect';
import './index.less';
import LoadGraph from './LoadGraph';

export interface GraphModelProps {
  onClose: () => void;
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
}
const GraphScopeMode: React.FC<GraphModelProps> = ({ onClose, updateGISite }) => {
  const [state, updateState] = React.useState({
    useToken: utils.getServerEngineContext()?.GRAPHSCOPE_USER_TOKEN,
  });
  const { useToken } = state;
  const updateToken = token => {
    updateState(pre => {
      return {
        ...pre,
        useToken: token,
      };
    });
  };
  return (
    <div>
      <EngineBanner
        docs="https://www.yuque.com/antv/gi/wuvtyf"
        title="大规模图计算系统"
        desc="GraphScope 是阿里巴巴达摩院智能计算实验室研发并开源的一站式图计算平台。依托于阿里海量数据和丰富场景，与达摩院的高水平研究，GraphScope 致力于针对实际生产场景中图计算的挑战，提供一站式高效的解决方案。"
        logo="https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*SRjBRZji8RsAAAAAAAAAAAAAARQnAQ"
      />
      <Connect updateToken={updateToken} token={useToken} />
      {useToken && <LoadGraph updateGISite={updateGISite} token={useToken} />}
    </div>
  );
};

export default GraphScopeMode;
