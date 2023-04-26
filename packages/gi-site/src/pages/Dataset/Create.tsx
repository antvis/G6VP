import { ApiOutlined, DeploymentUnitOutlined, FileExcelOutlined, GlobalOutlined } from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import { Tabs } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../components/FileServerEngine';
import RadioNote from '../../components/RadioNote';
import { getSearchParams } from '../../components/utils';
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
  // {
  //   id: 'DB',
  //   name: '关系型数据库',
  //   icon: <DatabaseOutlined />,
  // },
  {
    id: 'API',
    name: 'API 服务',
    icon: <ApiOutlined />,
  },
];

const { TabPane } = Tabs;

const DataSource: React.FunctionComponent<uploadPanel> = props => {
  const InputRef = React.useRef(null);
  //@ts-ignore
  const { history } = props;
  //@ts-ignore

  const [state, setState] = React.useState<{ active: string; engines: Record<string, EngineServer[]> }>(() => {
    const { searchParams, path } = getSearchParams(window.location);
    const active = searchParams.get('type') || 'FILE';
    return {
      active,
      engines: [],
    };
  });

  const callback = async params => {
    //@ts-ignore
    const payload = {
      ...params,
      id: `ds_${getUid()}`,
      type: 'user',
      gmtCreate: new Date(),
      //@ts-ignore
      name: params.name || InputRef.current?.input.value,
      wbType: 'GI',
    };
    await createDataset(payload);
    history.push('/dataset/list');
  };

  React.useEffect(() => {
    (async () => {
      const assets = await queryAssets();
      //@ts-ignore
      const AllEngineServer = [...utils.getCombineServer([FileServerEngine, ...assets.services])];

      const engines = {};
      AllEngineServer.forEach(item => {
        const { id, type } = item;

        const FILE_TYPES = ['file', 'FILE', 'FILE_GRAPH', 'FILE_GEO', 'FILE_SQL'];
        const GRAPH_TYPES = ['database', 'graph', 'GRAPH', 'DB_GRAPH'];
        const GEO_TYPES = ['DB_GEO', 'GEO'];
        const API_TYPES = ['API_GRAPH', 'API_GEO', 'API', 'api'];
        if (FILE_TYPES.indexOf(type) !== -1) {
          const pre = engines['FILE'];
          engines['FILE'] = pre ? [...pre, item] : [item];
        }
        if (GRAPH_TYPES.indexOf(type) !== -1) {
          const pre = engines['GRAPH'];
          engines['GRAPH'] = pre ? [...pre, item] : [item];
        }
        if (GEO_TYPES.indexOf(type) !== -1) {
          const pre = engines['GEO'];
          engines['GEO'] = pre ? [...pre, item] : [item];
        }
        if (API_TYPES.indexOf(type) !== -1) {
          const pre = engines['API'];
          engines['API'] = pre ? [...pre, item] : [item];
        }
      });
      setState(preState => {
        return {
          ...preState,
          engines: engines,
        };
      });
    })();
  }, []);
  const { engines, active } = state;

  const handleChangeType = value => {
    const { searchParams, path } = getSearchParams(window.location);
    searchParams.set('type', value);
    window.location.hash = `${path}?${searchParams.toString()}`;
    setState(preState => {
      return {
        ...preState,
        active: value,
      };
    });
  };

  const currentEngines = engines[state.active] || [];

  const content = currentEngines.map(server => {
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
        {/* <Icon type={icon} style={{ fontSize: '26px' }} /> */}
        {/** TODO 临时方案 */}
        {name === 'G6VP 官方数据服务' ? 'GraphJSON' : name}
      </div>
    );

    return (
      <TabPane tab={TabTitle} key={server.id}>
        {/** @ts-ignore */}
        <ServerComponent updateGISite={callback} />
      </TabPane>
    );
  });
  const emptyContent = (
    <TabPane tab={'开发中'} key="develope">
      <div style={{ padding: '8px 0px 0px 0px' }}>
        该类型的数据源还在建设中，请关注我们 github 进展：https://github.com/antvis/G6VP
      </div>
    </TabPane>
  );

  return (
    <>
      <div
        style={{
          marginBottom: '12px',
          background: 'var(--background-color)',
          padding: '24px 24px',
          borderRadius: '8px',
        }}
      >
        {/* TODO: 名字在最上方填写很容易忽略，而且也不是必填项，因为提交逻辑在各个数据源类型的子组件里，到了数据集完全懵逼认不出来。 */}
        {/* {active !== 'GRAPH' ? (
          <div style={{ marginBottom: '12px' }}>
            <label style={styles.label}>填写数据集名称</label>
            <Input placeholder="请输入数据集名称" ref={InputRef} style={{ width: '400px' }}></Input>
          </div>
        ) : (
          ''
        )} */}
        <div>
          <label style={styles.label}>选择数据源类型</label>
          <RadioNote items={ITEMS} value={active} onChange={handleChangeType} />
        </div>
      </div>

      <div style={{ background: 'var(--background-color)', padding: '24px 24px', borderRadius: '8px' }}>
        <Tabs tabPosition="left">{currentEngines.length === 0 ? emptyContent : content}</Tabs>
      </div>
    </>
  );
};

export default DataSource;
