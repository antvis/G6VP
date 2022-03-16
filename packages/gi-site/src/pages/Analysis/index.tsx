import GISDK from '@alipay/graphinsight';
import localforage from 'localforage';
import React from 'react';
import { Prompt } from 'react-router-dom';
import { useImmer } from 'use-immer';
import { Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getSearchParams } from '../../components/utils';
import { setDefaultAssetPackages } from '../../loader';
import { getProjectById } from '../../services/';
import { queryAssets } from '../../services/assets.market';
import { navbarOptions } from './Constants';
import { getComponentsByAssets, getElementsByAssets, getServicesByAssets } from './getAssets';
import getLayoutsByAssets from './getAssets/getLayoutsByAssets';
import { AnalysisContext } from './hooks/useContext';
import './index.less';
import MetaPanel from './MetaPanel';
import { ConfigRecommedor } from './recommendTools';
import UploadPanel from './uploadData/index';
import type { StateType } from './useModal';
import { initialState } from './useModal';
import { isObjectEmpty } from './utils';

// 配置不同的驱动优先级
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'GI-WebServer',
  version: 1.0,
  description: 'GraphInsight Local Server',
  storeName: 'project',
});

setDefaultAssetPackages();

const queryActiveAssetsInformation = ({ assets, data, config }) => {
  const components = getComponentsByAssets(assets.components, data, assets.services, config);
  const elements = getElementsByAssets(assets.elements, data);
  const layouts = getLayoutsByAssets(assets.layouts, data);
  const services = getServicesByAssets(assets.services, data);

  return {
    components,
    elements,
    services,
    layouts,
  };
};

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;

  const [state, updateState] = useImmer<StateType>(initialState);
  const {
    config,
    key,
    isReady,
    isSave,
    activeNavbar,
    collapse,
    data,
    assets,
    enableAI,
    projectConfig,
    activeAssetsInformation,
    activeAssetsKeys,
    activeAssets,
    isModalVisible,
  } = state;

  const handleChangeNavbar = opt => {
    const isSame = activeNavbar === opt.id;

    updateState(draft => {
      draft.activeNavbar = opt.id;
      draft.collapse = isSame ? !collapse : false;
    });
  };

  React.useLayoutEffect(() => {
    (async () => {
      updateState(draft => {
        draft.isReady = false;
      });
      const { searchParams } = getSearchParams(window.location);
      const activeNavbar = searchParams.get('nav') || 'data';
      const { data, config, activeAssetsKeys } = await getProjectById(projectId);
      const { transData, inputData } = data;

      const activeAssets = await queryAssets(projectId, activeAssetsKeys);
      const activeAssetsInformation = queryActiveAssetsInformation({ assets: activeAssets, data: transData, config });

      updateState(draft => {
        draft.id = projectId;
        draft.config = config;
        draft.projectConfig = config;
        draft.data = transData;
        draft.inputData = inputData;
        draft.isReady = true;
        draft.activeNavbar = activeNavbar;
        draft.serviceConfig = activeAssets.services;
        draft.assets = assets;
        draft.activeAssets = activeAssets;
        draft.activeAssetsKeys = activeAssetsKeys;
        draft.activeAssetsInformation = activeAssetsInformation;
      });
    })();
  }, [projectId, key]);

  const ACTIVE_ASSETS_KEYS = JSON.stringify(activeAssetsKeys);
  React.useEffect(() => {
    //TODO 依赖还有问题
    // console.log('activeAssetsKeys', activeAssetsKeys, ACTIVE_ASSETS_KEYS);
    (async () => {
      const activeAssets = await queryAssets(projectId, activeAssetsKeys);

      const activeAssetsInformation = queryActiveAssetsInformation({ assets: activeAssets, data, config });
      updateState(draft => {
        const configComponents = activeAssetsInformation.components.map(c => {
          const matchItem = draft.config.components.find(d => d.id === c.id) || c;
          return matchItem;
        });
        draft.config.components = configComponents;
        draft.activeAssets = activeAssets;
        draft.activeAssetsKeys = activeAssetsKeys;
        draft.activeAssetsInformation = activeAssetsInformation;
      });
    })();
  }, [ACTIVE_ASSETS_KEYS]);

  const getRecommenderCfg = params => {
    const { config, data } = params;
    const Recommender = new ConfigRecommedor(data);
    const layoutCfg = Recommender.recLayoutCfg();
    const nodeCfg = Recommender.recNodeCfg();
    const edgeCfg = Recommender.recEdgeCfg();
    const newGraphData = Recommender.graphData;
    // console.log('newGraphData', newGraphData)
    const newConfig = {
      ...config,
      node: {
        ...config.node,
        props: {
          ...config.node.props,
          ...nodeCfg,
        },
      },
      edge: {
        ...config.edge,
        props: {
          ...config.edge.props,
          ...edgeCfg,
        },
      },
      layout: {
        ...config.layout,
        props: {
          ...config.layout.props,
          ...layoutCfg,
        },
      },
    };
    return {
      newConfig: newConfig,
      newData: newGraphData,
    };
  };

  React.useLayoutEffect(() => {
    const { config, projectConfig, data } = state;

    if (isReady && data && enableAI) {
      const { newData, newConfig } = getRecommenderCfg({
        data: JSON.parse(JSON.stringify(data)),
        config,
      });
      updateState(draft => {
        draft.id = projectId;
        draft.config = newConfig;
        draft.data = newData; // 改变 data 是为了能把衍生出的属性加进去，比如 degree
      });
    } else if (!enableAI) {
      updateState(draft => {
        draft.id = projectId;
        draft.config = projectConfig;
      });
    }
  }, [projectId, isReady, enableAI]);

  React.useEffect(() => {
    const handler = ev => {
      ev.preventDefault();
      ev.returnValue = '配置未保存，确定离开吗？';
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, []);

  const isLoading = isObjectEmpty(config) || !isReady;

  const handleClose = () => {
    updateState(draft => {
      draft.isModalVisible = false;
    });
  };

  if (isLoading) {
    return (
      <div className="gi">
        <Loading />
      </div>
    );
  }
  const context = { context: state, updateContext: updateState };
  console.log('%c GRAPHINSIGHT RENDERING', 'color:lightgreen', state);

  return (
    <AnalysisContext.Provider value={context}>
      <div className="gi">
        <Prompt when={!isSave} message={() => '配置未保存，确定离开吗？'} />
        <div className="gi-navbar">
          <Navbar projectId={projectId} enableAI={enableAI} />
        </div>
        <div className="gi-analysis">
          <div className="gi-analysis-sidebar">
            <Sidebar options={navbarOptions} value={activeNavbar} onChange={handleChangeNavbar} />
          </div>
          <div className={`gi-analysis-conf ${collapse ? 'collapse' : ''}`}>
            <MetaPanel
              value={activeNavbar}
              data={data}
              activeAssetsKeys={activeAssetsKeys}
              /** 配置文件 */
              config={config}
              components={activeAssetsInformation.components}
              elements={activeAssetsInformation.elements}
              services={activeAssetsInformation.services}
              layouts={activeAssetsInformation.layouts}
            />
          </div>
          <div className="gi-analysis-workspace">
            <div className="gi-analysis-canvas">
              <GISDK
                config={config}
                /** 资产以Props的方式按需引入 */
                assets={{
                  components: activeAssets.components,
                  elements: activeAssets.elements,
                  layouts: activeAssets.layouts,
                }}
                services={activeAssetsInformation.services}
              ></GISDK>
            </div>
          </div>
        </div>
        {isModalVisible && (
          <UploadPanel visible={isModalVisible} handleClose={handleClose} initData={data}></UploadPanel>
        )}
      </div>
    </AnalysisContext.Provider>
  );
};

export default Analysis;
