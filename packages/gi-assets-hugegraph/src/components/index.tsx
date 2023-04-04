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
    HAS_CONNECT_SUCCESS: false,
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
        logo="https://user-images.githubusercontent.com/17706099/149281100-c296db08-2861-4174-a31f-e2a92ebeeb72.png"
        title="HUGEGRAPH DATABASE"
        desc="
         HugeGraph 是一款易用、高效、通用的图数据库。实现了 Apache TinkerPop3 框架、兼容 Gremlin 查询语言。"
        docs="https://www.yuque.com/antv/gi/diprhupwqwtcno8u"
      />
      <Connect updateToken={updateToken} token={HAS_CONNECT_SUCCESS} />
      {HAS_CONNECT_SUCCESS && <LoadGraph updateGISite={updateGISite} />}
    </div>
  );
};

export default GraphScopeMode;
