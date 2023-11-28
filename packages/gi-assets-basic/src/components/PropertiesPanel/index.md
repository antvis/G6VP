---
title: 属性面板
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
const services = [
  {
    id: `GI/${info.id}`,
    service: params => {
      const { data } = params;
      return new Promise(resolve => {
        return resolve(data);
      });
    },
  },
];
const App = () => {
  return (
    <div>
      <GISDK_TEST assets={Assets} activeAssets={[info]} services={services} />
    </div>
  );
};

export default App;
```
