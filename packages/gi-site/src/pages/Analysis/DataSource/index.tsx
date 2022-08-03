import { utils } from '@alipay/graphinsight';
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

const { TabPane } = Tabs;

const DataSource: React.FunctionComponent<uploadPanel> = props => {
  const { visible, handleClose, initData } = props;
  const { context, updateContext } = useContext();

  const CustomServer = utils.getCombineServer(context.activeAssets.services);

  return (
    <Drawer title="导入数据" visible={visible} width={'calc(100vw - 382px)'} onClose={handleClose}>
      <Tabs>
        {CustomServer.map(server => {
          //@ts-ignore
          const { component: ServerComponent } = server;
          return (
            <TabPane tab={server.name} key={server.id}>
              {/** @ts-ignore */}
              <ServerComponent />
            </TabPane>
          );
        })}
      </Tabs>
    </Drawer>
  );
};

export default DataSource;
