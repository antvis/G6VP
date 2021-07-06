import GISDK, { GIContext } from '@alipay/graphinsight';
import localforage from 'localforage';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { ConfigationPanel, Navbar, Sidebar } from '../../components';
// import { getEdgesByNodes } from '../../services';
import { getGraphData, getSubGraphData } from '../../services/index';
import { navbarOptions } from './Constants';
import './index.less';
import store from './redux';
import { isObjectEmpty } from './utils';

const TestComponents = () => {
  const gi = React.useContext(GIContext);
  const { graph } = gi;
  const { nodes, edges } = graph.save() as { nodes: any[]; edges: any[] };

  return (
    <div style={{ position: 'absolute', top: '80px', left: '20px', background: '#ddd' }}>
      Node: {nodes.length}
      Edge: {nodes.length}
    </div>
  );
};

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;
  const st = useSelector(state => state);
  const { config, key, isReady } = st;

  console.log('Analysis', st);

  const dispatch = useDispatch();

  const data = useSelector(state => state.data) || null;

  const [state, setState] = React.useState({
    activeNavbar: '',
    collapse: false,
  });
  const [isSave, setIsSave] = React.useState(true);

  const handleChangeNavbar = opt => {
    const isSame = state.activeNavbar === opt.id;
    setState({
      ...state,
      activeNavbar: opt.id,
      collapse: isSame ? !state.collapse : false,
    });
  };

  React.useLayoutEffect(() => {
    dispatch({
      type: 'update:config',
      isReady: false,
    });

    localforage
      .setItem('projectId', projectId)
      .then(id => {
        return localforage.getItem(projectId);
      })
      .then(res => {
        const { config, data } = res as any;
        dispatch({
          type: 'update:config',
          id: projectId,
          config,
          data: data,
          isReady: true,
        });
      });
    setState(preState => {
      return {
        ...preState,
        activeNavbar: 'style',
      };
    });
  }, [projectId]);

  React.useEffect(() => {
    setIsSave(false);
  }, [config]);

  React.useEffect(() => {
    window.addEventListener('beforeunload', ev => {
      ev.preventDefault();
      ev.returnValue = '配置未保存，确定离开吗？';
    });
  }, []);

  return (
    <div className="gi">
      <Prompt when={!isSave} message={() => '配置未保存，确定离开吗？'} />
      <div className="gi-navbar">
        <Navbar projectId={projectId} clickSave={() => setIsSave(true)} />
      </div>
      <div className="gi-analysis">
        <div className="gi-analysis-sidebar">
          <Sidebar options={navbarOptions} value={state.activeNavbar} onChange={handleChangeNavbar} />
        </div>
        <div className={`gi-analysis-conf ${state.collapse ? 'collapse' : ''}`}>
          {isReady && <ConfigationPanel config={config} value={state.activeNavbar} data={data} />}
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            {!isObjectEmpty(config) && isReady && (
              <GISDK
                key={key}
                config={config}
                services={{
                  getGraphData,
                  getSubGraphData,
                }}
              >
                <TestComponents />
              </GISDK>
            )}
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
