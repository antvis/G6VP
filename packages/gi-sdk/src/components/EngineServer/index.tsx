import { Select } from 'antd';
import React from 'react';
import { EngineBanner, GISiteParams, GraphSchemaData, utils } from '../../index';
import Connect from './Connect';
import './index.less';
import LoadGraph from './LoadGraph';

const { Option } = Select;

export interface GraphDBConfig {
  /** 操作文档 */
  docs: string;
  /** 数据库名称 */
  title: string;
  /** 数据库描述 */
  desc: string;
  /** 数据库logo */
  logo: string;
  /** 引擎ID，例如 TuGraph */
  engineId: string;
  /** 查询子图列表 */
  querySubGraphList: () => any[] | undefined;
  /** 查询图模型 Schema */
  queryGraphSchema: (params?: any) => GraphSchemaData;
  /** 查询图规模 */
  queryVertexLabelCount?: (params?: any) => any;
  /** 连接数据库 */
  connectDatabase?: (params?: any) => boolean;
  updateGISite?: (params: GISiteParams) => void;
  giSiteContext?: any;
}

const GraphDB: React.FC<GraphDBConfig> = props => {
  const {
    queryGraphSchema,
    querySubGraphList,
    queryVertexLabelCount,
    updateGISite,
    connectDatabase = () => true,
    engineId,
    logo,
    title,
    desc,
    docs,
  } = props;
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
      <EngineBanner docs={docs} title={title} desc={title} logo={logo} />
      <Connect engineId={engineId} connectDatabase={connectDatabase} updateToken={updateToken} token={useToken} />
      {useToken && (
        <LoadGraph
          engineId={engineId}
          queryGraphSchema={queryGraphSchema}
          querySubGraphList={querySubGraphList}
          queryVertexLabelCount={queryVertexLabelCount}
          updateGISite={updateGISite}
        />
      )}
    </div>
  );
};

export default GraphDB;
