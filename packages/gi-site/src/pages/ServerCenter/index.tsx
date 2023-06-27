import { DeploymentUnitOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Card, Empty } from 'antd';
import * as React from 'react';
import SegmentedTabs from '../../components/SegmentedTabs';
import { queryAssets } from '../../services/assets';
import Cards from './Cards';
import ServiceTable from './Table';
import $i18n from '../../i18n';
import './index.less';
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
    queryAssets().then(res => {
      const servers = utils.getCombineServer(res.services);
      const tables = servers.map(server => {
        const { id, services, name } = server;
        console.log(server);
        const matchTableData = Object.keys(services)
          .map(s => {
            const val = services[s];
            if (!val) return undefined;
            const { req, res, method, name } = val;
            return {
              id: `${id}/${s}`,
              name,
              req,
              res,
              method,
            };
          })
          .filter(c => c);
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
      <SegmentedTabs
        items={[
          {
            key: 'relation',
            label: $i18n.get({ id: 'gi-site.pages.ServerCenter.GraphEngine', dm: '图引擎' }),
            children: (
              <>
                <Cards data={lists} changeServerId={changeServerId}></Cards>
                <Card title={`${matchServer.name}`} style={{ margin: '12px 0px' }}>
                  <ServiceTable data={matchServer.table} />
                </Card>
              </>
            ),

            icon: <DeploymentUnitOutlined />,
          },
          {
            key: 'location',
            icon: <EnvironmentOutlined />,
            label: $i18n.get({ id: 'gi-site.pages.ServerCenter.GeographicEngine', dm: '地理引擎' }),
            children: (
              <Empty
                description={$i18n.get({ id: 'gi-site.pages.ServerCenter.UnderConstruction', dm: '正在建设中' })}
              />
            ),
          },
        ]}
      />
    </>
  );
};

export default ServerCenter;
