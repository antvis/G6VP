import GISDK, { GIContext } from '@alipay/graphinsight';
import Lockr from 'lockr';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ConfigationPanel, Navbar, Sidebar } from '../../components';
// import { getEdgesByNodes } from '../../services';
import { getGraphData, getSubGraphData } from '../../services/index';
import { configSchema, navbarOptions } from './Constants';
import './index.less';
import store from './redux';

const TestComponents = () => {
  const gi = React.useContext(GIContext);
  return <div style={{ position: 'absolute', top: '80px', left: '20px', background: 'red' }}>测试自定义组件</div>;
};

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;

  const config = useSelector(state => state.config);
  console.log('Analysis',config);

  const dispatch = useDispatch();

  console.log('props', props, projectId);

  Lockr.set('projectId', projectId);

  const [state, setState] = React.useState({
    activeNavbar: 'style',
    collapse: false,
  });

  const handleChangeNavbar = opt => {
    const isSame = state.activeNavbar === opt.id;
    setState({
      ...state,
      activeNavbar: opt.id,
      collapse: isSame ? !state.collapse : false,
    });
  };
  React.useEffect(() => {
    const { config } = Lockr.get(projectId);
    // debugger;
    dispatch({
      type: 'Update:Config',
      id: projectId,
      config,
    });
  }, [projectId]);

  const onChange = (evt) => {
    console.log("onChange", evt);
  }

  return (
    <div className="gi">
      <div className="gi-navbar">
        <Navbar history={history} />
      </div>
      <div className="gi-analysis">
        <div className="gi-analysis-sidebar">
          <Sidebar options={navbarOptions} value={state.activeNavbar} onChange={handleChangeNavbar} />
        </div>
        <div className={`gi-analysis-conf ${state.collapse ? 'collapse' : ''}`}>
          <ConfigationPanel value={state.activeNavbar} options={configSchema} onChange={onChange} />
        </div>
        <div className="gi-analysis-workspace">
          <div className="gi-analysis-canvas">
            <GISDK
              config={config}
              services={{
                getGraphData,
                getSubGraphData,
              }}
            >
              <TestComponents />
            </GISDK>
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
