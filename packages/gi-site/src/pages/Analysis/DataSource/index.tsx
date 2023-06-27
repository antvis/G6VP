import { Icon, utils } from '@antv/gi-sdk';
import { Drawer, Tabs } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../../components/FileServerEngine';
import { useContext } from '../../Analysis/hooks/useContext';
import $i18n from '../../../i18n';

interface uploadPanel {
  visible: boolean;
  handleClose: () => void;
}

const TYPE_ICONS = {
  file: { icon: 'icon-file-excel', name: $i18n.get({ id: 'gi-site.Analysis.DataSource.LocalFile', dm: '本地文件' }) },
  api: { icon: 'icon-api', name: $i18n.get({ id: 'gi-site.Analysis.DataSource.OnlineInterface', dm: '在线接口' }) },
  database: {
    icon: 'icon-database',
    name: $i18n.get({ id: 'gi-site.Analysis.DataSource.GraphDatabase', dm: '图数据库' }),
  },
};

const { TabPane } = Tabs;

const DataSource: React.FunctionComponent<uploadPanel> = props => {
  const { visible, handleClose } = props;
  const { context, updateGISite } = useContext();

  const CustomServer = [...utils.getCombineServer([FileServerEngine, ...context.activeAssets.services])];

  return (
    <Drawer
      title={$i18n.get({ id: 'gi-site.Analysis.DataSource.ImportData', dm: '导入数据' })}
      visible={visible}
      width={'calc(100vw - 382px)'}
      onClose={handleClose}
    >
      <Tabs tabPosition="left">
        {CustomServer.map(server => {
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
              <ServerComponent updateGISite={updateGISite} giSiteContext={context} onClose={handleClose} />
            </TabPane>
          );
        })}
      </Tabs>
    </Drawer>
  );
};

export default DataSource;
