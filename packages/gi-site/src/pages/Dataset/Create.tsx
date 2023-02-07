import { EngineServer, Icon, utils } from '@antv/gi-sdk';
import { Card, Input, Tabs } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../components/FileServerEngine';
import { queryAssets } from '../../services/assets';
import { createDataset } from '../../services/dataset';
import { getUid } from '../Workspace/utils';

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
  const InputRef = React.useRef(null);
  //@ts-ignore
  const { history } = props;
  //@ts-ignore

  const callback = async params => {
    //@ts-ignore

    const payload = {
      ...params,
      id: `ds_${getUid()}`,
      gmtCreate: new Date(),
      //@ts-ignore
      name: InputRef.current.input.value,
      ...params,
    };
    console.log('payload', payload);
    await createDataset(payload);
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
    <div>
      <Card bordered={false}>
        <div>
          <Input placeholder="请输入数据集名称" ref={InputRef}></Input>
        </div>
      </Card>

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
    </div>
  );
};

export default DataSource;
