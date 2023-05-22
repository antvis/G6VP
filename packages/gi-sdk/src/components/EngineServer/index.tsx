import { Select } from 'antd';
import React from 'react';
import { EngineBanner, GISiteParams, GraphSchemaData, utils } from '../../index';
import Connect from './Connect';
import LoadGraph from './LoadGraph';
import './index.less';

const { Option } = Select;

export interface GraphDBConfig {
  /** 是否通过 Socket 服务链接，从而不需要 Node 转发服务 */
  isSocketConnect?: boolean;
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
  /** 连接数据库 */
  connectDatabase?: (params?: any) => Promise<boolean>;
  /** 查询子图列表 */
  querySubGraphList: () => Promise<any[]> | undefined;
  /** 查询图模型 Schema */
  queryGraphSchema: (params?: any) => Promise<GraphSchemaData>;
  /** 查询图规模 */
  queryVertexLabelCount?: (params?: any) => any;

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
    isSocketConnect,
  } = props;
  const [state, updateState] = React.useState({
    useToken: utils.getServerEngineContext()?.ENGINE_USER_TOKEN,
  });
  const { useToken } = state;
  const updateToken = () => {
    updateState(pre => {
      return {
        ...pre,
        useToken: utils.getServerEngineContext()?.ENGINE_USER_TOKEN,
      };
    });
  };
  return (
    <div>
      <EngineBanner docs={docs} title={title} desc={desc} logo={logo} />
      <Connect
        isSocketConnect={isSocketConnect}
        engineId={engineId}
        connectDatabase={connectDatabase}
        updateToken={updateToken}
        token={useToken}
      />
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
