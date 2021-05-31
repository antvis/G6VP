import GIMetaPanel from '@alipay/gi-meta';
import GISDK from '@alipay/graphinsight';
import { Layout } from 'antd';
import React from 'react';

const config = {};

const Analysis = () => {
  return (
    <Layout>
      <h1>GraphInsight 属性面板配置区域</h1>
      <GIMetaPanel />
      <h1>GraphInsight 核心画布渲染区域</h1>

      <GISDK config={config} />
    </Layout>
  );
};

export default Analysis;
