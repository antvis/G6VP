import GISDK, { Initializer, SimpleEdge, SimpleNode, useContext } from '@antv/gi-sdk';
import { Utils } from '@antv/graphin';
import React from 'react';
interface DEMOProps {}

const Counter = props => {
  const { graph, updateContext } = useContext();

  const { title } = props;
  const nodes = graph.getAllNodesData().length;
  console.log('Counter render....', nodes);
  const handleClick = () => {
    const newData = Utils.mock(Math.round(Math.random() * 300))
      .circle()
      .graphin();

    const preData = graph.getAllNodesData().length;
    console.log('Pre Counts', preData);

    updateContext(draft => {
      draft.data = newData;
    });
  };
  return (
    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
      {title}: {nodes}
      <button onClick={handleClick}>add node</button>
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
  nodes: [{ id: 'SimpleNode' }],
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
      return new Promise(resolve => {
        resolve({
          nodes: [
            { id: 'node-1', data: {} },
            { id: 'node-2', data: {} },
          ],
          edges: [],
        });
      });
    },
  },
  {
    name: '查询图模型',
    method: 'GET',
    id: 'GI/GI_SERVICE_SCHEMA',
    service: async () => {
      return new Promise(resolve => {
        resolve({
          nodes: [],
          edges: [],
        });
      });
    },
  },
];

const DEMO: React.FunctionComponent<DEMOProps> = props => {
  return <GISDK assets={assets} config={config} services={services} />;
};

export default DEMO;
