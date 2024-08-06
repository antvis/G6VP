import {
  ApiOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileExcelOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { utils } from '@antv/gi-sdk';
import type { EngineServer } from '@antv/gi-sdk/lib/typing';
import { Spin, Tabs } from 'antd';
import * as React from 'react';
import FileServerEngine from '../../components/FileServerEngine';
import RadioNote from '../../components/RadioNote';
import { getSearchParams } from '../../components/utils';
import { queryAssets } from '../../services/assets';
import { createDataset } from '../../services/dataset';
import { getUid } from '../Workspace/utils';
import $i18n from '../../i18n';

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
  file: { icon: 'icon-file-excel', name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.LocalFile', dm: '本地文件' }) },
  api: { icon: 'icon-api', name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.OnlineInterface', dm: '在线接口' }) },
  database: {
    icon: 'icon-database',
    name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.GraphDatabase', dm: '图数据库' }),
  },
};

const ITEMS = [
  {
    id: 'FILE',
    name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.LocalFile', dm: '本地文件' }),
    icon: <FileExcelOutlined />,
  },
  {
    id: 'GRAPH',
    name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.GraphDatabase', dm: '图数据库' }),
    icon: <DeploymentUnitOutlined />,
  },
  // {
  //   id: 'GEO',
  //   name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.GeographicDatabase', dm: '地理数据库' }),
  //   icon: <GlobalOutlined />,
  // },
  // {
  //   id: 'DB',
  //   name: '关系型数据库',
  //   icon: <DatabaseOutlined />,
  // },
  // {
  //   id: 'API',
  //   name: $i18n.get({ id: 'gi-site.pages.Dataset.Create.ApiService', dm: 'API 服务' }),
  //   icon: <ApiOutlined />,
  // },
];

const { TabPane } = Tabs;

const DataSource: React.FunctionComponent<uploadPanel> = props => {
  const InputRef = React.useRef(null);
  //@ts-ignore
  const { history } = props;
  //@ts-ignore

  const [state, setState] = React.useState<{
    activeType: string;
    activeEngine?: string;
    engines: Record<string, EngineServer[]>;
    isReady: boolean;
  }>(() => {
    const { searchParams, path } = getSearchParams(window.location);
    const activeType = searchParams.get('type') || 'FILE';
    const activeEngine = searchParams.get('engine') ?? undefined;
    return {
      activeType,
      engines: {},
      isReady: false,
      activeEngine,
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
          isReady: true,
        };
      });
    })();
  }, []);
  const { engines, activeType, activeEngine, isReady } = state;
  const currentEngines = engines[state.activeType] || [];

  const handleChangeEngine = (value?: string) => {
    const { searchParams, path } = getSearchParams(window.location);
    if (value) {
      searchParams.set('engine', value);
    } else {
      searchParams.delete('engine');
    }
    window.location.hash = `${path}?${searchParams.toString()}`;
    setState(preState => {
      return {
        ...preState,
        activeEngine: value,
      };
    });
  };

  const handleChangeType = value => {
    const { searchParams, path } = getSearchParams(window.location);
    searchParams.set('type', value);
    window.location.hash = `${path}?${searchParams.toString()}`;
    setState(preState => {
      return {
        ...preState,
        activeType: value,
      };
    });

    // 切换类型时同时触发更新引擎选择相关数据
    handleChangeEngine(engines[value]?.[0]?.id);
  };

  const renderEngineTabs = () => {
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
          {name === $i18n.get({ id: 'gi-site.pages.Dataset.Create.OfficialGVpDataService', dm: 'G6VP 官方数据服务' })
            ? 'GraphJSON'
            : name}
        </div>
      );

      return (
        <TabPane tab={TabTitle} key={server.id}>
          {/** @ts-ignore */}
          <ServerComponent updateGISite={callback} />
        </TabPane>
      );
    });

    return (
      <Tabs tabPosition="left" activeKey={activeEngine} onChange={handleChangeEngine}>
        {content}
      </Tabs>
    );
  };

  const emptyTabs = (
    <Tabs tabPosition="left">
      <TabPane tab={$i18n.get({ id: 'gi-site.pages.Dataset.Create.Developing', dm: '开发中' })} key="develope">
        <div style={{ padding: '8px 0px 0px 0px' }}>
          {$i18n.get({
            id: 'gi-site.pages.Dataset.Create.ThisTypeOfDataSource',
            dm: '该类型的数据源还在建设中，请关注我们 github 进展：https://github.com/antvis/G6VP',
          })}
        </div>
      </TabPane>
    </Tabs>
  );

  const loadingTabs = (
    <Tabs tabPosition="left">
      <TabPane tab={$i18n.get({ id: 'gi-site.pages.Dataset.Create.Loading', dm: '加载中' })} key="loading">
        <div style={{ padding: '8px 0px 0px 0px' }}>
          <Spin size="small" style={{ marginRight: '8px' }} />
          {$i18n.get({
            id: 'gi-site.pages.Dataset.Create.AssetsIsLoading',
            dm: 'Please wait while the asset is loading',
          })}
        </div>
      </TabPane>
    </Tabs>
  );

  const renderTabs = () => {
    if (!isReady) {
      return loadingTabs;
    }

    if (currentEngines.length === 0) {
      return emptyTabs;
    }

    return renderEngineTabs();
  };

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
        <div>
          <label style={styles.label}>
            {$i18n.get({ id: 'gi-site.pages.Dataset.Create.SelectADataSourceType', dm: '选择数据源类型' })}
          </label>
          <RadioNote items={ITEMS} value={activeType} onChange={handleChangeType} />
        </div>
      </div>

      <div style={{ background: 'var(--background-color)', padding: '24px 24px', borderRadius: '8px' }}>
        {renderTabs()}
      </div>
    </>
  );
};

export default DataSource;
