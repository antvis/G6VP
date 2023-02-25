import {
  ApiOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileExcelOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { EngineServer, Icon, utils } from '@antv/gi-sdk';
import { Input, Tabs } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../components/FileServerEngine';
import RadioNote from '../../components/RadioNote';
import { queryAssets } from '../../services/assets';
import { createDataset } from '../../services/dataset';
import { getUid } from '../Workspace/utils';

interface uploadPanel {
  visible: boolean;
  handleClose: () => void;
}

const styles = {
  label: {
    display: 'block',
    padding: '8px 0px',
  },
};
const TYPE_ICONS = {
  file: { icon: 'icon-file-excel', name: '本地文件' },
  api: { icon: 'icon-api', name: '在线接口' },
  database: { icon: 'icon-database', name: '图数据库' },
};

const ITEMS = [
  {
    id: 'FILE',
    name: '本地文件',
    icon: <FileExcelOutlined />,
  },
  {
    id: 'GRAPH',
    name: '图数据库',
    icon: <DeploymentUnitOutlined />,
  },
  {
    id: 'GEO',
    name: '地理数据库',
    icon: <GlobalOutlined />,
  },
  {
    id: 'DB',
    name: '关系型数据库',
    icon: <DatabaseOutlined />,
  },
  {
    id: 'API',
    name: '自定义服务',
    icon: <ApiOutlined />,
  },
];

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

  const handleChangeType = e => {
    console.log('e', e);
  };

  return (
    <>
      <div style={{ marginBottom: '12px', background: '#fff', padding: '24px 24px', borderRadius: '4px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={styles.label}>填写数据集名称</label>
          <Input placeholder="请输入数据集名称" ref={InputRef} style={{ width: '400px' }}></Input>
        </div>
        <div>
          <label style={styles.label}>选择数据源类型</label>
          <RadioNote items={ITEMS} defaultValue="FILE" onChange={handleChangeType} />
        </div>
      </div>

      <div style={{ background: '#fff', padding: '24px 24px', borderRadius: '4px' }}>
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
    </>
  );
};

export default DataSource;
