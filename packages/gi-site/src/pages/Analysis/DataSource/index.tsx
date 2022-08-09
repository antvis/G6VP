import { Icon, utils } from '@alipay/graphinsight';
import { Drawer, Steps, Tabs, Upload } from 'antd';
import * as React from 'react';
import { useContext } from '../../Analysis/hooks/useContext';

const { Step } = Steps;
const { Dragger } = Upload;
interface uploadPanel {
  visible: boolean;
  initData: any;
  handleClose: () => void;
}

const TYPE_ICONS = {
  file: { icon: 'icon-file-excel', name: '本地文件' },
  api: { icon: 'icon-api', name: '在线接口' },
  database: { icon: 'icon-database', name: '图数据库' },
};

const { TabPane } = Tabs;

const DataSource: React.FunctionComponent<uploadPanel> = props => {
  const { visible, handleClose, initData } = props;
  const { context, updateContext, updateGISite } = useContext();

  const CustomServer = utils.getCombineServer(context.activeAssets.services);

  return (
    <Drawer title="导入数据" visible={visible} width={'calc(100vw - 0px)'} onClose={handleClose}>
      <Tabs tabPosition="left">
        {CustomServer.map(server => {
          //@ts-ignore
          const { component: ServerComponent } = server;

          const { icon } = TYPE_ICONS[server.type];
          const TabTitle = (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon type={icon} style={{ fontSize: '26px' }} /> {server.name}
            </div>
          );
          return (
            <TabPane tab={TabTitle} key={server.id}>
              {/** @ts-ignore */}
              <ServerComponent updateGISite={updateGISite} />
            </TabPane>
          );
        })}
      </Tabs>
    </Drawer>
  );
};

export default DataSource;
