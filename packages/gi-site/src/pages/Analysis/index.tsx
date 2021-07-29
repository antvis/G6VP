import GISDK, { GIComponents, GIElements } from '@alipay/graphinsight';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { ConfigationPanel, Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getProjectById } from '../../services/analysis';
import { navbarOptions } from './Constants';
import { getComponentsByAssets, getElementsByAssets, getServicesByAssets } from './getAssets';
import './index.less';
import store, { StateType } from './redux';
import { isObjectEmpty } from './utils';

/** https://github.com/systemjs/systemjs/blob/main/docs/nodejs.md */
// const { System } = require('systemjs');

const GIServices = [
  {
    id: 'get_initial_graph',
    content: `(data)=>{return data}`,
    mode: 'mock',
  },
  {
    id: 'gi_drilling_one',
    content: `(data)=>{ console.log('drilling'); return data}`,
    mode: 'mock',
  },
];

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
  } = state;

  console.log('Analysis', state);

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

    // System.import('https://gw.alipayobjects.com/os/lib/antd/4.16.8/dist/antd.min.js').then(res => {
    //   console.log('res', res);
    // });

    getProjectById(projectId).then(res => {
      const { config, data } = res as any;
      /** 目前先Mock，都需要直接从服务端获取services,components,elements 这些资产 */
      const components = getComponentsByAssets(GIComponents, data);
      const elements = getElementsByAssets(GIElements, data);
      const services = getServicesByAssets(GIServices, data);

      dispatch({
        type: 'update:config',
        id: projectId,
        config,
        data: data,
        isReady: true,
        activeNavbar: 'style',
        services,
        components,
        elements,
      });
    });
  }, [projectId]);

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
        <Navbar projectId={projectId} />
      </div>
      <div className="gi-analysis">
        <div className="gi-analysis-sidebar">
          <Sidebar options={navbarOptions} value={activeNavbar} onChange={handleChangeNavbar} />
        </div>
        <div className={`gi-analysis-conf ${collapse ? 'collapse' : ''}`}>
          <ConfigationPanel
            config={config}
            value={activeNavbar}
            data={data}
            services={services}
            dispatch={dispatch}
            components={components}
            refreshKey={refreshComponentKey}
            elements={elements}
          />
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            <GISDK key={key} config={config} services={services}></GISDK>
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
