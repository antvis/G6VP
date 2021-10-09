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
import './index.less';
/** gi-meta废弃，属于gi-site的一部分 */
import MetaPanel from './MetaPanel';
import { ConfigRecommedor } from './recommendTools';
import store, { StateType } from './redux';
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

  React.useLayoutEffect(() => {
    dispatch({
      type: 'update:config',
      isReady: false,
    });

    getProjectById(projectId).then(project => {
      console.log('getProjectById', project);

      const config = JSON.parse(project.projectConfig);
      const data = JSON.parse(project.data);
      // const serviceConfig = JSON.parse(project.serviceConfig);

      queryAssets(projectId).then(assets => {
        const serviceConfig = assets.services;
        /** 目前先Mock，都需要直接从服务端获取services,components,elements 这些资产 */
        const components = getComponentsByAssets(assets.components, data, serviceConfig, config);
        const elements = getElementsByAssets(assets.elements, data);
        const services = getServicesByAssets(serviceConfig, data);

        dispatch({
          type: 'update:config',
          id: projectId,
          config,

          projectConfig: config,
          data: data,
          isReady: true,
          activeNavbar: 'style',
          serviceConfig,
          services,
          components,
          elements,
          assets,
        });
      });
    });
  }, [projectId, key]);

  React.useLayoutEffect(() => {
    const { config, projectConfig } = state;
    console.log('original cfgs', config);
    if (isReady && data && enableAI) {
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
      console.log('recommended cfgs', layoutCfg, nodeCfg, edgeCfg);
      dispatch({
        type: 'update:config',
        id: projectId,
        config: newConfig,
        data: newGraphData, // 改变 data 是为了能把衍生出的属性加进去，比如 degree
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

  const isLoading = isObjectEmpty(config) || !isReady;
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
            refreshKey={refreshComponentKey}
            /** 配置文件 */
            config={config}
            /** 全量的的组件，比config中的components多了meta字段，以及默认计算出defaultProps */
            components={components}
            /** 全量的的元素 */
            elements={elements}
            /** 全量的的服务 */
            services={services}
          />
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            <GISDK
              // key={key}
              config={config}
              /** 资产以Props的方式按需引入 */
              assets={{
                ...assets,
                services,
              }}
            ></GISDK>
          </div>
        </div>
      </div>
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
