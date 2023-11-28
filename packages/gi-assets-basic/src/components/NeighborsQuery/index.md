---
title: 邻居查询
order: 0
group:
  title: 基础资产
  path: /basic
nav:
  title: 资产包
  path: /assets
  order: 1
---

```jsx
import * as React from 'react';
import { GISDK_TEST } from '@antv/gi-sdk';
import * as Assets from '@antv/gi-assets-basic';
import Asset from './index.tsx';

const { registerMeta, info } = Asset;
let timer;
const services = [
  {
    id: `GI/${info.id}`,
    service: async params => {
      return new Promise(resolve => {
        const { ids, nodes } = params;
        const newData = nodes
          .map(node => {
            const { id, nodeType } = node;
            return {
              nodes: [
                {
                  id,
                  data: {},
                },
                {
                  id: `${id}-1`,
                  data: {},
                },
                {
                  id: `${id}-2`,
                  data: {},
                },
                {
                  id: `${id}-3`,
                  nodeType,
                },
              ],

              edges: [
                {
                  id: `${id}_${id}-1`,
                  source: id,
                  target: `${id}-1`,
                  data: {},
                },
                {
                  id: `${id}_${id}-2`,
                  source: id,
                  target: `${id}-2`,
                  data: {},
                },
                {
                  id: `${id}_${id}-3`,
                  source: id,
                  target: `${id}-3`,
                  data: {},
                },
              ],
            };
          })
          .reduce(
            (acc, curr) => {
              return {
                nodes: [].concat(acc.nodes, curr.nodes),
                edges: [].concat(acc.edges, curr.edges),
              };
            },
            { nodes: [], edges: [] },
          );
        clearTimeout(timer);
        timer = setTimeout(() => {
          resolve(newData);
        }, 1000);
      });
    },
  },
  {
    id: `GI/${info.id}Menu`,
    service: async () => {
      const menu = [
        {
          label: '一度查询',
          code: 1,
        },
        {
          label: '二度查询',
          code: 2,
        },
      ];
      return new Promise(resolve => {
        resolve(menu);
      });
    },
  },
];

const App = () => {
  return (
    <div>
      <GISDK_TEST assets={Assets} activeAssets={[info, { id: 'Loading', type: 'AUTO' }]} services={services} />
    </div>
  );
};

export default App;
```
