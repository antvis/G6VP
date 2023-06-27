import { EngineServer } from '@antv/gi-sdk';
import * as React from 'react';
import { GI_SERVICE_SCHEMA } from './Initializer';
import { connect, querySubGraphList, queryVertexLabelCount } from './Neo4jService';
import $i18n from '../i18n';
export interface ServerProps {
  updateGISite: () => void;
}

const Server: React.FunctionComponent<ServerProps> = props => {
  const { updateGISite } = props;
  return (
    <EngineServer
      engineId="Neo4j"
      logo="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*X4I6QZIDjY8AAAAAAAAAAAAADmJ7AQ/original"
      title="NEO4J DATABASE"
      desc={$i18n.get({
        id: 'neo4j.src.services.Engine.NeoJHasMoreThan',
        dm: 'Neo4j 拥有超过 950 家企业客户，是全球领先的可扩展图形技术提供商，为超过 75% 的财富 100 强企业提供连接数据应用程序。',
      })}
      docs="https://www.yuque.com/antv/gi/otnlbq2dc9q1f8gt"
      isSocketConnect={true}
      //@ts-ignore
      queryGraphSchema={GI_SERVICE_SCHEMA.service}
      //@ts-ignore
      querySubGraphList={querySubGraphList}
      queryVertexLabelCount={queryVertexLabelCount}
      //@ts-ignore
      connectDatabase={connect}
      updateGISite={updateGISite}
    />
  );
};

export default Server;
