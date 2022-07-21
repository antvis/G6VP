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
      const { services } = res;
      const servicesMap = new Map();
      const servicesTable = [];
      services.forEach(item => {
        const { id, name, pkg, version, ...otherServices } = item;
        const match = servicesMap[id];
        if (match) {
          servicesMap[id] = {
            ...match,
            ...otherServices,
          };
        } else {
          servicesMap[id] = item;
        }
      });
      const lists = Object.values(servicesMap);

      const tables = lists.map(server => {
        const { id, name, pkg, version, ...otherServices } = server;
        const matchTableData = Object.keys(otherServices).map(s => {
          const val = otherServices[s];
          const args = getFuncArgs(val.service);
          const detail = stringify(val.service);
          return {
            id: `${id}/${s}`,
            name: val.name,
            req: args.join(','),
            res: '-',
            detail,
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
          lists,
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
