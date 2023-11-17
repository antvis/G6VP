---
title: 操作栏
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

const App = () => {
  return (
    <div>
      <GISDK_TEST
        assets={Assets}
        activeAssets={[
          {
            id: 'Toolbar',
            type: 'GICC',
          },
          {
            id: 'ZoomIn',
            type: 'GIAC',
          },
          {
            id: 'FilterPanel',
            type: 'GIAC_CONTENT',
          },
          {
            id: 'ZoomOut',
            type: 'GIAC',
          },
        ]}
      />
    </div>
  );
};

export default App;
```
