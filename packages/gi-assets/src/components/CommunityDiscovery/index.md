## CommunityDiscovery

```jsx
import React from "react";
import CommunityDiscovery from "./Component";
import GISDK, { Mock } from "@alipay/graphinsight";

const DEMO = () => {
  const { config } = Mock;
  config.components = [
    {
      id: "CommunityDiscovery",
      props: {},
      enable: true,
    },
  ];
  
  config.layout = {
    props: {
      type: 'graphin-force',
    }
  }

  const services = [
    {
      id: 'GI_SERVICE_INTIAL_GRAPH',
      service: () => {
        return new Promise(resolve => {
          resolve({
            nodes: [{ id: 'node-1' }, { id: 'node-2' }, { id: 'node-3' }, { id: 'node-4' }, { id: 'node-5' }, { id: 'node-6' }, { id: 'node-7' }, { id: 'node-8' }, { id: 'node-9' }, { id: 'node-10' }, { id: 'node-11' }],
            edges: [
              { source: 'node-1', target: 'node-2' },
              { source: 'node-1', target: 'node-3' },
              { source: 'node-1', target: 'node-4' },
              { source: 'node-1', target: 'node-5' },
              { source: 'node-5', target: 'node-6' },
              { source: 'node-5', target: 'node-7' },
              { source: 'node-5', target: 'node-8' },
              { source: 'node-2', target: 'node-7' },
              { source: 'node-2', target: 'node-8' },
              { source: 'node-5', target: 'node-8' },
              { source: 'node-7', target: 'node-9' },
              { source: 'node-7', target: 'node-10' },
              { source: 'node-8', target: 'node-11' },
            ],
          });
        });
      },
    },
  ];
  const elements = {
    MyNode: {
      info: {
        id: 'MyNode',
        name: '我的节点',
      },
      registerShape: () => {},
      registerMeta: () => {},
      registerTransform: (data, meta) => {
        return data.nodes.map(node => {
          return {
            id: node.id,
            type: 'graphin-circle',
            data: node,
            style: {
              label: {
                value: node.id,
              },
            },
          };
        });
      },
    },
    MyEdge: {
      info: {
        id: 'MyEdge',
        name: '我的边',
      },
      registerShape: () => {},
      registerMeta: () => {},
      registerTransform: (data, meta) => {
        return data.edges.map(edge => {
          return {
            source: edge.source,
            target: edge.target,
            type: 'graphin-circle',
            data: edge,
          };
        });
      },
    },
  };
  const assets = {
    elements,
    services,
    components: {
      CommunityDiscovery: {
        info: { id: "CommunityDiscovery" },
        component: CommunityDiscovery,
        registerMeta: () => {},
      },
    }
  }

  return <GISDK config={config} assets={assets} />;
};

export default DEMO;
```
