import GISDK from '@alipay/graphinsight';
import localforage from 'localforage';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { ConfigationPanel, Navbar, Sidebar } from '../../components';
import Loading from '../../components/Loading';
import { getProjectById } from '../../services/analysis';
import { navbarOptions } from './Constants';
import './index.less';
import store from './redux';
import { isObjectEmpty } from './utils';

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

const getSourceData = async id => {
  const project = await localforage.getItem(id);
  return project.data;
};

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}

// const services = getServices(projectId);
// let data = sourceData || getSourceData(projectId);

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
  const st = useSelector(state => state);
  const { config, key, isReady, isSave, activeNavbar, collapse, data, services } = st;

  console.log('Analysis', st);

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
    getProjectById(projectId).then(res => {
      const { config, data } = res as any;
      const sers = getServices(projectId);
      const services = genServices(sers, data);
      dispatch({
        type: 'update:config',
        id: projectId,
        config,
        data: data,
        services,
        isReady: true,
        activeNavbar: 'style',
      });
    });
  }, [projectId]);

  React.useEffect(() => {
    window.addEventListener('beforeunload', ev => {
      ev.preventDefault();
      ev.returnValue = '配置未保存，确定离开吗？';
    });
  }, []);
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
          <ConfigationPanel config={config} value={activeNavbar} data={data} services={services} />
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
