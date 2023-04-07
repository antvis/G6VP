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
    useToken: utils.getServerEngineContext()?.GALAXYBASE_USER_TOKEN,
  });
  const { useToken } = state;
  const updateToken = () => {
    updateState(pre => {
      return {
        ...pre,
        useToken: utils.getServerEngineContext()?.GALAXYBASE_USER_TOKEN,
      };
    });
  };
  return (
    <div>
      <EngineBanner
        docs="https://galaxybase.com/"
        title="Galaxybase"
        desc="Galaxybase是国内首款全自主知识产权的超大规模分布式并行原生图平台产品，拥有优异的数据读写查询
        性能、强⼤的可视化分析能⼒、丰富的可编程接⼝和开箱即用的图算法引擎，是集存储、计算、分析于一体的图数据全⽣命周期⼀站式管理平台。 "
        logo={`${window['GI_PUBLIC_PATH']}image/galaxybase_logo.png`}
      />
      <Connect updateToken={updateToken} token={useToken} />
      {useToken && <LoadGraph updateGISite={updateGISite} />}
    </div>
  );
};

export default GraphScopeMode;
