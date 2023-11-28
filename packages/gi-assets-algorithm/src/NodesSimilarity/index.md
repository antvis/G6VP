---
title: 节点相似性
order: 0
group:
  title: 算法资产
  path: /algorithm
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
const { id } = info;

Assets.components[id] = Asset;

const App = () => {
  return (
    <div>
      <GISDK_TEST assets={Assets} activeAssets={[info]} />
    </div>
  );
};

export default App;
```
