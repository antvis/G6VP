import { utils } from '@alipay/graphinsight';
import { Card } from 'antd';
import * as React from 'react';
import BaseNavbar from '../../components/Navbar/BaseNavbar';
import { getCombinedAssets } from '../../loader';
import { stringify } from '../Analysis/getAssets/utils';
import Cards from './Cards';
import './index.less';
import ServiceTable from './Table';
import UploadAssets from './Upload';
import { getFuncArgs } from './utils';
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
        const { id, name, services } = server;
        const matchTableData = Object.keys(services).map(s => {
          const val = services[s];
          const args = getFuncArgs(val.service);
          const detail = stringify(val.service);
          return {
            ...val,
            req: args.join(','),
            res: '-',
            detail,
            id: `${id}/${s}`,
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
      <BaseNavbar active="services"></BaseNavbar>
      <div className="gi-assets-container">
        <Card title="引擎管理" extra={<UploadAssets />}>
          <Cards data={lists} changeServerId={changeServerId}></Cards>
        </Card>
        <Card title={`${matchServer.name}`} style={{ margin: '12px 0px' }}>
          <ServiceTable data={matchServer.table} />
        </Card>
      </div>
    </>
  );
};

export default ServerCenter;
