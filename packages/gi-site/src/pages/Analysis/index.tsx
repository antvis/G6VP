import GISDK, { GIContext } from '@alipay/graphinsight';
import { Input, Layout } from 'antd';
import React from 'react';
import { getGraphData, getSubGraphData } from '../../services/index';

const { TextArea } = Input;

const config = {
  components: [
    {
      id: 'LEGEND-A',
      categoryId: 'legend',
      meta: {},
      props: {},
      enable: true,
    },
    {
      id: 'LEGEND-Offical',
      categoryId: 'legend',
      meta: {},
      props: {},
      enable: false,
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
};
export type Config = typeof config;

const TestComponents = () => {
  const gi = React.useContext(GIContext);
  return <div style={{ position: 'absolute', top: '80px', left: '20px', background: 'red' }}>测试自定义组件</div>;
};

const Analysis = () => {
  return (
    <Layout>
      <h1>GraphInsight 组件市场</h1>

      {/* <h1>GraphInsight 属性面板配置区域</h1>
      <GIMetaPanel /> */}
      <h1>GraphInsight 核心画布渲染区域</h1>

      <GISDK config={config} services={{ getGraphData, getSubGraphData }}>
        {/* <TestComponents /> */}
      </GISDK>
    </Layout>
  );
};

export default Analysis;
