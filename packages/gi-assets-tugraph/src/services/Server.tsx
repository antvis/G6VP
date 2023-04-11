import { EngineServer } from '@antv/gi-sdk';
import * as React from 'react';
import {
  connectTuGraphDataSource,
  queryGraphSchema,
  querySubGraphList,
  queryVertexLabelCount,
} from '../services/TuGraphService';

export interface ServerProps {}

const Server: React.FunctionComponent<ServerProps> = props => {
  return (
    <EngineServer
      engineId="TuGraph"
      docs="https://www.yuque.com/antv/gi/wuvtyf"
      title="高性能图数据库"
      desc="TuGraph 是蚂蚁集团自主研发的大规模图计算系统，提供图数据库引擎和图分析引擎。其主要特点是大数据量存储和计算，高吞吐率，以及灵活的 API，同时支持高效的在线事务处理（OLTP）和在线分析处理（OLAP）"
      logo="https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ"
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
      //@ts-ignore
      querySubGraphList={querySubGraphList}
      queryVertexLabelCount={queryVertexLabelCount}
      //@ts-ignore
      connectDatabase={connectTuGraphDataSource}
    />
  );
};

export default Server;
