---
title: 组件测试
order: 1
group:
  path: /gi-sdk
  title: GISDK
  order: 0
nav:
  title: GISDK
  path: /sdk
  order: 1
---

`@antv/gi-sdk` 提供了 `GISDK_TEST` 组件，用于组件的本地测试，而无需在 G6VP 站点中研发。相比 GISDK 而言，它不用写繁琐的 Config 配置，而是通过资产包的 `registerMeta` 信息自动生成初始化配置，再配合「Setting」的按钮，可视化调整配置，模拟资产在 G6VP 产品中的表现。如下图所示

```jsx
import * as React from 'react';
import { GISDK_TEST } from '@antv/gi-sdk';
import * as Assets from '@antv/gi-assets-basic';

const services = [
  {
    id: `GI/PropertiesPanel`,
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
      <GISDK_TEST
        assets={Assets}
        activeAssets={[
          { id: 'FilterPanel', type: 'GIAC_CONTENT' },
          { id: 'PropertiesPanel', type: 'AUTO' },
          { id: 'LassoSelect', type: 'GIAC' },
          { id: 'ZoomIn', type: 'GIAC' },
          { id: 'ZoomOut', type: 'GIAC' },
        ]}
        services={services}
      />
    </div>
  );
};

export default App;
```

## 详细解析

组件拥有 3 个属性，`assets`和 `services` 和 GISDK 的属性保持一致。`activeAssets` 用于告知需要哪些激活的资产，这对于资产的单独测试很有帮助。

| 属性           | 类型                      | 描述       |
| -------------- | ------------------------- | ---------- |
| `assets`       | `GIAssets`                | 资产包     |
| `activeAssets` | `{id:string;type:string}` | 激活的资产 |
| `services`     | `string`                  | 资产服务   |

如代码所示

```jsx | pure
import * as React from 'react';
import { GISDK_TEST } from '@antv/gi-sdk';
import * as Assets from '@antv/gi-assets-basic';

const services = [
  {
    id: `GI/PropertiesPanel`,
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
      <GISDK_TEST
        assets={Assets}
        activeAssets={[
          { id: 'FilterPanel', type: 'GIAC_CONTENT' },
          { id: 'PropertiesPanel', type: 'AUTO' },
          { id: 'LassoSelect', type: 'GIAC' },
          { id: 'ZoomIn', type: 'GIAC' },
          { id: 'ZoomOut', type: 'GIAC' },
        ]}
        services={services}
      />
    </div>
  );
};

export default App;
```
