---
title: 节点提示框
order: 0
group:
  title: 基础资产
  path: /basic
nav:
  title: 资产包
  path: /assets
  order: 1
---

## Tooltip 节点提示框

```jsx
import * as React from 'react';
import { GISDK_TEST } from '@antv/gi-sdk';
import * as Assets from '@antv/gi-assets-basic';
import Asset from './index.tsx';

const { registerMeta, info } = Asset;

const App = () => {
  return (
    <div>
      <GISDK_TEST assets={Assets} activeAssets={[info]} />
    </div>
  );
};

export default App;
```

```

```
