import { Icon, utils } from '@alipay/graphinsight';
import { Drawer, Steps, Tabs, Upload } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../../components/FileServerEngine';
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
  // 补充一个GI的ServerComponent实现：FileServerEngine
  const CustomServer = [...utils.getCombineServer([...context.activeAssets.services, FileServerEngine])];

  return (
    <Drawer title="导入数据" visible={visible} width={'calc(100vw - 382px)'} onClose={handleClose}>
      <Tabs tabPosition="left">
        {CustomServer.map(server => {
          //@ts-ignore
          const { component: ServerComponent } = server;
          const { icon, name } = TYPE_ICONS[server.type || 'api'];
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
