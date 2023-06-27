import { EngineServer } from '@antv/gi-sdk';
import * as React from 'react';
import { connect, querySubGraphList, queryVertexLabelCount } from './EngineService';
import { GI_SERVICE_SCHEMA } from './Initializer';
import $i18n from '../i18n';
export interface ServerProps {
  updateGISite: () => void;
}

const Server: React.FunctionComponent<ServerProps> = props => {
  const { updateGISite } = props;
  return (
    <EngineServer
      engineId="JanusGraph"
      logo="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Owq5Tb7HsQsAAAAAAAAAAAAADmJ7AQ/original"
      title="JANUSGRAPH DATABASE"
      desc={$i18n.get({
        id: 'janusgraph.src.services.Engine.JanusgraphIsAHighlyScalable',
        dm: 'JanusGraph 是一个高度可扩展的图数据库，针对存储和查询分布在多机集群中的数十亿个顶点和边的大型图进行了优化。 JanusGraph 是一个事务型数据库，可以支持数千个并发用户、复杂遍历和分析图查询。',
      })}
      docs="https://www.yuque.com/antv/gi/otnlbq2dc9q1f8gt"
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
