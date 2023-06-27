import { EngineServer } from '@antv/gi-sdk';
import React from 'react';
import { GI_SERVICE_SCHEMA } from './Initializer';
import { connectTuGraphDataSource, querySubGraphList, queryVertexLabelCount } from './TuGraphService';
import $i18n from '../i18n';
export const ENGINE_ID = 'TuGraph';
const Server = props => {
  const { updateGISite } = props;
  return (
    <EngineServer
      engineId={ENGINE_ID}
      docs="https://www.yuque.com/antv/gi/wuvtyf"
      title={$i18n.get({ id: 'tugraph.src.services.Engine.HighPerformanceGraphDatabase', dm: '高性能图数据库' })}
      desc={$i18n.get({
        id: 'tugraph.src.services.Engine.TugraphIsALargeScale',
        dm: 'TuGraph 是蚂蚁集团自主研发的大规模图计算系统，提供图数据库引擎和图分析引擎。其主要特点是大数据量存储和计算，高吞吐率，以及灵活的 API，同时支持高效的在线事务处理（OLTP）和在线分析处理（OLAP）',
      })}
      logo="https://gw.alipayobjects.com/mdn/rms_3ff49c/afts/img/A*xqsZTKLVHPsAAAAAAAAAAAAAARQnAQ"
      queryGraphSchema={GI_SERVICE_SCHEMA.service}
      querySubGraphList={querySubGraphList}
      connectDatabase={connectTuGraphDataSource}
      queryVertexLabelCount={queryVertexLabelCount}
      updateGISite={updateGISite}
    />
  );
};

export default Server;
