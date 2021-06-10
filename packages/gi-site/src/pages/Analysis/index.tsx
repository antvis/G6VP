import GISDK, { GIContext } from '@alipay/graphinsight';
import { Input } from 'antd';
import Lockr from 'lockr';
import React from 'react';
import { Provider } from 'react-redux';
import { ConfigationPanel, Navbar, Sidebar } from '../../components';
import { getEdgesByNodes } from '../../services';
import { getGraphData, getSubGraphData } from '../../services/index';
import { configSchema, navbarOptions } from './Constants';
import './index.less';
import store from './redux';

const { TextArea } = Input;

const configs = {
  liaoyuan: {
    components: [
      {
        id: 'Legend',
        categoryId: 'legend',
        meta: {},
        props: {},
        enable: true,
      },
      {
        id: 'NodeTooltip',
        categoryId: 'tooltip',
        meta: {},
        props: {
          mappingKeys: ['name', 'type'],
        },
        enable: true,
      },
      {
        id: 'MiniMap',
        meta: {},
        props: {},
        enable: true,
      },
      {
        id: 'Liaoyuan-Click-Entity-Node',
        categoryId: 'interaction',
        meta: {},
        props: {},
        enable: true,
      },
      {
        id: 'Liaoyuan-Click-Event-Node',
        categoryId: 'interaction',
        meta: {},
        props: {},
        enable: true,
      },
    ],
    node: [
      {
        id: 'graphin-node',

        categoryId: 'node',
        enable: true,
        /** style.keyshape.color */
        color: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 'red',
            enable: false,
          },
        ],
        /** style.keyshape.size */
        size: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: [40, 20, 30, 20, 10],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 30,
            enable: false,
          },
        ],
        /** style.label */
        label: {
          key: 'name',
        },
      },
    ],
    edge: [
      {
        id: 'graphin-edge',
        categoryId: 'edge',
        /** style.keyshape.stroke */
        color: {
          key: 'type',
          enum: ['red', 'blue', 'green', 'yellow'],
        },
        /** style.keyshape.size */
        size: {
          key: 'weight',
        },
        /** style.label */
        label: {
          key: 'name',
        },
      },
    ],
    layout: {
      categoryId: 'layout',
      id: 'dagre', //'graphin-force',
      options: {
        rankdir: 'LR', // 可选，默认为图的中心
        align: undefined, // 可选
        nodesep: 15, // 可选
        ranksep: 40, // 可选
        // preset: {
        //   type: 'concentric',
        // },
      },
    },
    graph: {},
  },
  demo: {
    components: [
      {
        id: 'Legend',
        categoryId: 'legend',
        meta: {},
        props: {},
        enable: true,
      },
    ],
    node: [
      {
        id: 'graphin-node',
        categoryId: 'node',
        enable: true,
        /** style.keyshape.color */
        color: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: ['grey', 'blue', 'green', 'yellow', 'pink'],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 'red',
            enable: false,
          },
        ],
        /** style.keyshape.size */
        size: [
          /** 第一种是映射模式 */
          {
            mode: 'mapping',
            key: 'type',
            enum: [40, 20, 30, 20, 10],
            enable: true,
          },
          /** 第二种是固定模式 */
          {
            mode: 'fixed',
            value: 30,
            enable: false,
          },
        ],
        /** style.label */
        label: {
          key: 'id',
        },
      },
    ],
    layout: {
      categoryId: 'layout',
      id: 'dagre', //'graphin-force',
      options: {},
    },
  },
};

const services = {
  liaoyuan: {
    getGraphData: () => {
      return getGraphData(data => {
        const nodes = data.nodes.filter(node => {
          return node.data.type === 'ENTITY' || node.data.type === 'EVENT';
        });
        const edges = getEdgesByNodes(nodes, data.edges);
        return {
          nodes,
          edges,
        };
      });
    },
    getSubGraphData,
  },
  demo: {
    getGraphData: getGraphData,
  },
};
export type Config = typeof config;

const TestComponents = () => {
  const gi = React.useContext(GIContext);
  return <div style={{ position: 'absolute', top: '80px', left: '20px', background: 'red' }}>测试自定义组件</div>;
};

const Analysis = props => {
  const { history, match } = props;
  const { projectId } = match.params;
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
  const service = services[projectId];
  const config = configs[projectId];

  return (
    <Provider store={store}>
      <div className="gi">
        <div className="gi-navbar">
          <Navbar history={history} />
        </div>
        <div className="gi-analysis">
          <div className="gi-analysis-sidebar">
            <Sidebar options={navbarOptions} value={state.activeNavbar} onChange={handleChangeNavbar} />
          </div>
          <div className={`gi-analysis-conf ${state.collapse ? 'collapse' : ''}`}>
            <ConfigationPanel value={state.activeNavbar} options={configSchema} />
          </div>
          <div className="gi-analysis-workspace">
            <div className="gi-analysis-canvas">
              <GISDK config={config} services={service}>
                <TestComponents />
              </GISDK>
            </div>
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default Analysis;
