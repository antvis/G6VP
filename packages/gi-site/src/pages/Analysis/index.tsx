import GISDK from '@alipay/graphinsight';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getProjectById } from '../../services/';
import { queryAssets } from '../../services/assets.market';
import { navbarOptions } from './Constants';
import { getComponentsByAssets, getElementsByAssets, getServicesByAssets } from './getAssets';
import getLayoutsByAssets from './getAssets/getLayoutsByAssets';
import './index.less';
/** gi-meta废弃，属于gi-site的一部分 */
import MetaPanel from './MetaPanel';
import { ConfigRecommedor } from './recommendTools';
import store, { StateType } from './redux';
import UploadPanel from './uploadData/index';
import { isObjectEmpty } from './utils';

/** https://github.com/systemjs/systemjs/blob/main/docs/nodejs.md */
// const { System } = require('systemjs');

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;
  const state = useSelector((state: StateType) => state);
  const {
    config,
    key,
    isReady,
    isSave,
    activeNavbar,
    collapse,
    data,
    services,
    components,
    refreshComponentKey,
    elements,
    assets,
    enableAI,
    projectConfig,
    activeAssetsInformation,
    activeAssetsKeys,
    activeAssets,
    isModalVisible,
  } = state;

  const dispatch = useDispatch();

  const handleChangeNavbar = opt => {
    const isSame = activeNavbar === opt.id;
    dispatch({
      type: 'update:config',
      activeNavbar: opt.id,
      collapse: isSame ? !collapse : false,
    });
  };

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

  React.useLayoutEffect(() => {
    (async () => {
      dispatch({
        type: 'update:config',
        isReady: false,
      });
      const { data, config, activeAssetsKeys } = await getProjectById(projectId);
      const activeAssets = await queryAssets(projectId, activeAssetsKeys);
      const activeAssetsInformation = queryActiveAssetsInformation({ assets: activeAssets, data, config });
      dispatch({
        type: 'update:config',
        id: projectId,
        config,
        projectConfig: config,
        data: data,
        isReady: true,
        activeNavbar: 'style',
        //@ts-ignore
        serviceConfig: activeAssets.services,
        // services,
        // components,
        // elements,
        assets,
        activeAssets,
        activeAssetsKeys,
        activeAssetsInformation,
      });
    })();
  }, [projectId, key]);

  const ACTIVE_ASSETS_KEYS = JSON.stringify(activeAssetsKeys);
  React.useEffect(() => {
    //TODO 依赖还有问题
    console.log('activeAssetsKeys', activeAssetsKeys, ACTIVE_ASSETS_KEYS);
    (async () => {
      const activeAssets = await queryAssets(projectId, activeAssetsKeys);
      const activeAssetsInformation = queryActiveAssetsInformation({ assets: activeAssets, data, config });
      dispatch({
        type: 'FREE',
        update: draft => {
          const configComponents = activeAssetsInformation.components.map(c => {
            const matchItem = draft.config.components.find(d => d.id === c.id) || c;
            return matchItem;
          });

          draft.config.components = configComponents;
          draft.activeAssets = activeAssets;
          draft.activeAssetsKeys = activeAssetsKeys;
          draft.activeAssetsInformation = activeAssetsInformation;
          draft.refreshComponentKey = Math.random();
        },
      });
      // dispatch({
      //   type: 'update:config',
      //   activeAssets,
      //   activeAssetsInformation,
      //   refreshComponentKey: Math.random(),
      // });
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
    console.log('original cfgs', config);
    if (isReady && data && enableAI) {
      const { newData, newConfig } = getRecommenderCfg({
        data,
        config,
      });
      dispatch({
        type: 'update:config',
        id: projectId,
        config: newConfig,
        data: newData, // 改变 data 是为了能把衍生出的属性加进去，比如 degree
      });
    } else if (!enableAI) {
      dispatch({
        type: 'update:config',
        id: projectId,
        config: projectConfig,
      });
    }
  }, [projectId, isReady, enableAI]);

  // React.useEffect(() => {
  //   window.addEventListener('beforeunload', ev => {
  //     ev.preventDefault();
  //     ev.returnValue = '配置未保存，确定离开吗？';
  //   });
  // }, []);
  console.log('%c GRAPHINSIGHT RENDERING', 'color:yellow', state);
  const isLoading = isObjectEmpty(config) || !isReady;

  const handleClose = () => {
    dispatch({
      type: 'update',
      isModalVisible: false,
    });
  };

  if (isLoading) {
    return (
      <div className="gi">
        <Loading />
      </div>
    );
  }

  return (
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
            dispatch={dispatch}
            activeAssetsKeys={activeAssetsKeys}
            refreshKey={refreshComponentKey}
            /** 配置文件 */
            config={config}
            /** 全量的的组件，比config中的components多了meta字段，以及默认计算出defaultProps */
            components={activeAssetsInformation.components}
            /** 全量的的元素 */
            elements={activeAssetsInformation.elements}
            /** 全量的的服务 */
            services={activeAssetsInformation.services}
            layouts={activeAssetsInformation.layouts}
          />
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            <GISDK
              // key={key}
              config={config}
              /** 资产以Props的方式按需引入 */
              assets={{
                ...activeAssets,
                services: activeAssetsInformation.services,
              }}
            ></GISDK>
          </div>
        </div>
      </div>
      <UploadPanel visible={isModalVisible} handleClose={handleClose} initData={data}></UploadPanel>
    </div>
  );
};

const WrapAnalysis = props => {
  return (
    <Provider store={store}>
      <Analysis {...props} />
    </Provider>
  );
};

export default WrapAnalysis;
