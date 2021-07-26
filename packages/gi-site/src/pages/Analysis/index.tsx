import GISDK, { GIComponents, GIElements } from '@alipay/graphinsight';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { ConfigationPanel, Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getProjectById } from '../../services/analysis';
import { navbarOptions } from './Constants';
import './index.less';
import store, { StateType } from './redux';
import { isObjectEmpty } from './utils';

/** https://github.com/systemjs/systemjs/blob/main/docs/nodejs.md */
// const { System } = require('systemjs');

const getServices = id => {
  return [
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
};
const getComponents = id => {
  return GIComponents(id);
};

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}

const genServices = (services, sourceData) => {
  let data = sourceData;
  return services.map(s => {
    const { id, content, mode } = s;
    if (mode === 'mock') {
      const service = new Promise(async resolve => {
        let transFn = data => {
          return data;
        };
        try {
          transFn = looseJsonParse(content);
          if (transFn) {
            data = transFn(data);
          }
        } catch (error) {
          console.error(error);
        }
        return resolve(data);
      });
      return {
        id,
        service,
      };
    }
    // if mode==='api'
    return {
      id,
      service: fetch(content),
    };
  });
};

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;
  const state = useSelector((state: StateType) => state);
  const { config, key, isReady, isSave, activeNavbar, collapse, data, services, components, refreshComponentKey } =
    state;

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
      /** 目前先Mock，都需要直接从服务端获取services和components，即数据服务和组件市场 */
      const sers = getServices(projectId);
      const components = getComponents(projectId);
      /** 动态生成自己的服务实例 */
      const services = genServices(sers, data);
      dispatch({
        type: 'update:config',
        id: projectId,
        config,
        data: data,
        services,
        isReady: true,
        activeNavbar: 'style',
        components,
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
            elements={GIElements}
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
