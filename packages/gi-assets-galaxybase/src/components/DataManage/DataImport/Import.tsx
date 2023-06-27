import { DisconnectOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Drawer, message } from 'antd';
import * as React from 'react';
import GalaxybaseDataLoadPanel from '../../../services/ServerComponent';
import $i18n from '../../../i18n';

interface DataImportProps {}

const DataImport: React.FunctionComponent<DataImportProps> = props => {
  const useToken = localStorage.getItem('GALAXYBASE_USER_TOKEN');

  const [state, stateState] = React.useState({
    visible: true,
    connectStatus: useToken,
  });
  const { visible } = state;
  const handleImport = () => {
    stateState(preState => {
      return {
        ...preState,
        visible: true,
      };
    });
  };
  const handleClose = () => {
    stateState(preState => {
      return {
        ...preState,
        visible: false,
      };
    });
  };

  const closeConnect = () => {
    localStorage.removeItem('GALAXYBASE_USER_TOKEN');
    localStorage.removeItem('CURRENT_GALAXYBASE_SUBGRAPH');
    message.success(
      $i18n.get({
        id: 'galaxybase.DataManage.DataImport.Import.DisconnectedFromGalaxybase',
        dm: '已断开与 Galaxybase 的连接',
      }),
    );

    stateState(preState => {
      return {
        ...preState,
        connectStatus: null,
      };
    });
  };

  React.useEffect(() => {
    stateState(preState => {
      return {
        ...preState,
        connectStatus: localStorage.getItem('GALAXYBASE_USER_TOKEN'),
      };
    });
  }, [localStorage.getItem('GALAXYBASE_USER_TOKEN')]);
  return (
    <div>
      {state.connectStatus ? (
        <Button danger onClick={closeConnect} size="small" style={{ marginRight: 8 }} icon={<DisconnectOutlined />}>
          {$i18n.get({ id: 'galaxybase.DataManage.DataImport.Import.Disconnect', dm: '断开连接' })}
        </Button>
      ) : (
        <Button onClick={handleImport} size="small" icon={<LinkOutlined />}>
          {$i18n.get({ id: 'galaxybase.DataManage.DataImport.Import.Connection', dm: '连接' })}
        </Button>
      )}

      <Drawer
        title={$i18n.get({ id: 'galaxybase.DataManage.DataImport.Import.ConnectToGraphDatabase', dm: '连接图数据库' })}
        visible={visible}
        onClose={handleClose}
        width="1000"
        contentWrapperStyle={{
          transform: 'none',
        }}
      >
        <GalaxybaseDataLoadPanel onClose={handleClose} />
      </Drawer>
    </div>
  );
};

export default DataImport;
