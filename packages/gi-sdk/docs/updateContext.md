---
title: updateContext
order: 1
group:
  path: /api
  title: API
  order: 3
nav:
  title: GISDK
  path: /sdk
  order: 1
---

`updateContext` 可以更新全局 `context`

```jsx | pure
import React from 'react';
import { useContext } from '@antv/gi-sdk';

const MyComponent = () => {
  const { context, updateContext } = useContext();

  useEffect(() => {
    updateContext(preStore => {
      // 更新数据
      preStore.data = { nodes: [], edges: [] };
      // 更新布局
      preStore.layout = {
        id: 'Force',
        props: {},
      };
    });
    // 更新loading
    updateContext(preStore => {
      preStore.isLoading = true;
    });
  }, []);

  return null;
};
```
