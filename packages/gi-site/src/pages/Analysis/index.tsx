import GISDK, { GIContext } from '@alipay/graphinsight';
import Lockr from 'lockr';
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
  return <div style={{ position: 'absolute', top: '80px', left: '20px', background: 'red' }}>测试自定义组件</div>;
};

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;
  const st = useSelector(state => state);
  const { config, key } = st;

  console.log('Analysis', st);

  const dispatch = useDispatch();

  Lockr.set('projectId', projectId);

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

  React.useEffect(() => {
    const { config, data } = Lockr.get(projectId);
    dispatch({
      type: 'update:config',
      id: projectId,
      config,
      data: data,
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
        <Navbar history={history} projectId={projectId} clickSave={() => setIsSave(true)} />
      </div>
      <div className="gi-analysis">
        <div className="gi-analysis-sidebar">
          <Sidebar options={navbarOptions} value={state.activeNavbar} onChange={handleChangeNavbar} />
        </div>
        <div className={`gi-analysis-conf ${state.collapse ? 'collapse' : ''}`}>
          <ConfigationPanel config={config} value={state.activeNavbar} data={data} />
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            {!isObjectEmpty(config) && (
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
