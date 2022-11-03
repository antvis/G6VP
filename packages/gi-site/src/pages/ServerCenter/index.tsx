import { utils } from '@antv/gi-sdk';
import { Card } from 'antd';
import * as React from 'react';
import { getCombinedAssets } from '../../loader';
import Cards from './Cards';
import './index.less';
import ServiceTable from './Table';
interface AssetsCenterProps {}

const ServerCenter: React.FunctionComponent<AssetsCenterProps> = props => {
  const [state, setState] = React.useState({
    isReady: false,
    lists: [] as any[],
    serverId: 'GI',

    tables: [] as { id: string; name: string; table: any[] }[],
  });
  const changeServerId = val => {
    setState(preState => {
      return {
        ...preState,
        serverId: val,
      };
    });
  };

  React.useEffect(() => {
    getCombinedAssets().then(res => {
      const servers = utils.getCombineServer(res.services);

      const tables = servers.map(server => {
        const { id, services } = server;
        const matchTableData = Object.keys(services).map(s => {
          const val = services[s];
          const { req, res, method, name } = val;

          // const args = getFuncArgs(val.service);
          // const detail = stringify(val.service);
          return {
            id: `${id}/${s}`,
            name,
            req,
            res,
            method,
          };
        });
        return {
          id,
          name,
          table: matchTableData,
        };
      });

      setState(preState => {
        return {
          ...preState,
          isReady: true,
          lists: Object.values(servers),
          tables,
        };
      });
    });
  }, []);

  const { lists, serverId, tables } = state;
  if (!state.isReady) {
    return null;
  }
  const matchServer = tables.find(c => {
    return c.id === serverId;
  }) || {
    table: [],
    name: '',
  };
  console.log('state', state, matchServer);

  return (
    <>
      <Card title="引擎管理">
        <Cards data={lists} changeServerId={changeServerId}></Cards>
      </Card>
      <Card title={`${matchServer.name}`} style={{ margin: '12px 0px' }}>
        <ServiceTable data={matchServer.table} />
      </Card>
    </>
  );
};

export default ServerCenter;
