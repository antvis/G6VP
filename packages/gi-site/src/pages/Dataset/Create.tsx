import { EngineServer, Icon, utils } from '@antv/gi-sdk';
import { Tabs } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../components/FileServerEngine';
import { queryAssets } from '../../services/assets';
import { createDataset } from '../../services/dataset';

interface uploadPanel {
  visible: boolean;
  handleClose: () => void;
}

const TYPE_ICONS = {
  file: { icon: 'icon-file-excel', name: '本地文件' },
  api: { icon: 'icon-api', name: '在线接口' },
  database: { icon: 'icon-database', name: '图数据库' },
};

const { TabPane } = Tabs;

const DataSource: React.FunctionComponent<uploadPanel> = props => {
  //@ts-ignore
  const { history } = props;
  //@ts-ignore

  const callback = async params => {
    console.log('params', params);
    await createDataset(params);
    history.push('/dataset/list');
  };
  const [state, setState] = React.useState<{ engines: EngineServer[] }>({
    engines: [],
  });

  React.useEffect(() => {
    (async () => {
      const assets = await queryAssets();
      //@ts-ignore
      const CustomServer = [...utils.getCombineServer([FileServerEngine, ...assets.services])];
      setState({
        engines: CustomServer,
      });
    })();
  }, []);
  const { engines } = state;

  return (
    <Tabs tabPosition="left">
      {engines.map(server => {
        const { component: ServerComponent, name } = server;
        if (!ServerComponent) {
          return null;
        }
        const { icon } = TYPE_ICONS[server.type || 'api'];

        const TabTitle = (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon type={icon} style={{ fontSize: '26px' }} />
            {name}
          </div>
        );
        return (
          <TabPane tab={TabTitle} key={server.id}>
            {/** @ts-ignore */}
            <ServerComponent updateGISite={callback} />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default DataSource;
