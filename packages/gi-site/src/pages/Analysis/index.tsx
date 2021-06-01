import GIMetaPanel from '@alipay/gi-meta';
import GISDK from '@alipay/graphinsight';
import { Layout } from 'antd';
import React from 'react';
import { getGraphData } from '../../services/index';

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
          enum: ['grey', 'blue', 'green', 'yellow'],
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
          enum: [50, 20, 30, 40, 10, 60],
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

const Analysis = () => {
  return (
    <Layout>
      <h1>GraphInsight 属性面板配置区域</h1>
      <GIMetaPanel />
      <h1>GraphInsight 核心画布渲染区域</h1>

      <GISDK config={config} services={{ getGraphData }} />
    </Layout>
  );
};

export default Analysis;
