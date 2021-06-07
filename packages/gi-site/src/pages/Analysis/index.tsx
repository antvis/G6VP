import GISDK, { GIContext } from '@alipay/graphinsight';
import { Input, Layout } from 'antd';
import React from 'react';
import { getGraphData } from '../../services/index';

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
      id: 'Liaoyuan-Click-Entity',
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
    id: 'graphin-force',
    options: {
      preset: {
        type: 'concentric',
      },
    },
  },
  graph: {},
};
export type Config = typeof config;

const TestComponents = () => {
  const gi = React.useContext(GIContext);
  return <div style={{ position: 'absolute', top: '80px', left: '20px', background: 'red' }}>测试自定义组件</div>;
};

const handleChange = e => {
  console.log('e', e.target.value);
};

const Analysis = () => {
  return (
    <Layout>
      <h1>GraphInsight 组件市场</h1>
      <TextArea onChange={handleChange} autoSize={{ minRows: 10, maxRows: 20 }}></TextArea>
      {/* <h1>GraphInsight 属性面板配置区域</h1>
      <GIMetaPanel /> */}
      <h1>GraphInsight 核心画布渲染区域</h1>

      <GISDK config={config} services={{ getGraphData }}>
        <TestComponents />
      </GISDK>
    </Layout>
  );
};

export default Analysis;
