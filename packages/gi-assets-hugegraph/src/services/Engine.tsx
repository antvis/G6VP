import { EngineServer } from '@antv/gi-sdk';
import * as React from 'react';
import { listGraphs } from './HugeGraphService';
import { GI_SERVICE_SCHEMA } from './Initializer';
import $i18n from '../i18n';
export interface ServerProps {
  updateGISite: () => void;
}

const Server: React.FunctionComponent<ServerProps> = props => {
  const { updateGISite } = props;
  return (
    <EngineServer
      engineId="HugeGraph"
      logo="https://user-images.githubusercontent.com/17706099/149281100-c296db08-2861-4174-a31f-e2a92ebeeb72.png"
      title="HUGEGRAPH DATABASE"
      desc={$i18n.get({
        id: 'hugegraph.src.services.Engine.HugegraphIsAnEasyTo',
        dm: 'HugeGraph 是一款易用、高效、通用的图数据库。实现了 Apache TinkerPop3 框架、兼容 Gremlin 查询语言。',
      })}
      docs="https://www.yuque.com/antv/gi/diprhupwqwtcno8u"
      //@ts-ignore
      queryGraphSchema={GI_SERVICE_SCHEMA.service}
      //@ts-ignore
      querySubGraphList={listGraphs}
      updateGISite={updateGISite}
    />
  );
};

export default Server;
