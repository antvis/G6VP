import GISDK from '@alipay/graphinsight';
/** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
import * as ComponentAssets from '@alipay/graphinsight/es/components';
import * as ElementAssets from '@alipay/graphinsight/es/elements';
/** 临时这么引用：这部分拆分到 gi-assets 的包中，未来在云端构建 */
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getProjectById } from '../../services/analysis';
import { navbarOptions } from './Constants';
import { getComponentsByAssets, getElementsByAssets, getServicesByAssets } from './getAssets';
import './index.less';
/** gi-meta废弃，属于gi-site的一部分 */
import MetaPanel from './MetaPanel';
import store, { StateType } from './redux';
import { isObjectEmpty } from './utils';

console.log(ComponentAssets, ElementAssets);
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
      const components = getComponentsByAssets(ComponentAssets, data);
      const elements = getElementsByAssets(ElementAssets, data);
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
            assets={{
              elements: ElementAssets,
              components: ComponentAssets,
              services,
            }}
          />
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            <GISDK
              key={key}
              config={config}
              /** 资产以Props的方式按需引入 */
              assets={{
                elements: ElementAssets,
                components: ComponentAssets,
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
