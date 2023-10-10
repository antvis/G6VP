import GISDK, { Initializer, SimpleEdge, SimpleNode, useContext } from '@antv/gi-sdk';
import React from 'react';
import { data, schemaData } from './const';
interface DEMOProps {}

const Counter = props => {
  const { graph, updateContext } = useContext();

  const { title } = props;
  const nodes = graph.getAllNodesData().length;
  console.log('Counter render....', nodes);

  return (
    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
      {title}: {nodes}
    </div>
  );
};

const CounterAsset = {
  info: {
    id: 'Counter',
    type: 'AUTO',
  },
  registerMeta: () => {
    return {};
  },
  component: Counter,
};

const assets = {
  elements: {
    SimpleEdge,
    SimpleNode,
  },
  layouts: {},
  components: {
    Initializer,
    Counter: CounterAsset,
  },
};

const config = {
  nodes: [
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#ddd',
        label: [],
      },
      name: '官方节点',
      order: -1,
      expressions: [],
      logic: true,
      groupName: '默认样式',
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#3056E3',
        label: ['account_balance^^id'],
      },
      name: '官方节点',
      expressions: [
        {
          name: 'icon',
          operator: 'eql',
          value: 'account_balance',
        },
      ],
      order: 0,
      logic: true,
      groupName: 'ACCOUNT_BALANCE TYPE',
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#faad14',
        label: ['account_box^^id'],
      },
      name: '官方节点',
      expressions: [
        {
          name: 'icon',
          operator: 'eql',
          value: 'account_box',
        },
      ],
      order: 1,
      logic: true,
      groupName: 'ACCOUNT_BOX TYPE',
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#a0d911',
        label: ['-^^id'],
      },
      name: '官方节点',
      expressions: [
        {
          name: 'icon',
          operator: 'eql',
          value: '-',
        },
      ],
      order: 2,
      logic: true,
      groupName: '- TYPE',
    },
  ],
  edges: [{ id: 'SimpleEdge' }],
  components: [
    {
      id: 'Initializer',
      type: 'INITIALIZER',
      name: '初始化器',
      props: {
        serviceId: 'GI/GI_SERVICE_INTIAL_GRAPH',
        schemaServiceId: 'GI/GI_SERVICE_SCHEMA',
        GI_INITIALIZER: true,
        aggregate: false,
        transByFieldMapping: false,
      },
    },
    {
      id: 'Counter',
      type: 'AUTO',
      props: {
        title: '画布节点数量',
      },
    },
  ],
  layout: {
    id: 'Concentric',
    props: {
      type: 'concentric',
    },
  },
  pageLayout: {},
};

const services = [
  {
    name: '初始化查询',
    method: 'GET',
    id: 'GI/GI_SERVICE_INTIAL_GRAPH',
    service: async () => {
      console.log('data', data);
      return new Promise(resolve => {
        resolve(data);
      });
    },
  },
  {
    name: '查询图模型',
    method: 'GET',
    id: 'GI/GI_SERVICE_SCHEMA',
    service: async () => {
      return new Promise(resolve => {
        resolve(schemaData);
      });
    },
  },
];

const DEMO: React.FunctionComponent<DEMOProps> = props => {
  return <GISDK assets={assets} config={config} services={services} />;
};

export default DEMO;
