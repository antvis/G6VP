---
title: useContext
order: 0
group:
  path: /api
  title: API
  order: 3
nav:
  title: GISDK
  path: /sdk
  order: 1
---

`useContext` 是 GISDK 提供的一个重要方法，它基于 React 的 useContext 和 valtio 库实现。核心用法如下

```jsx | pure
import React from 'react';
import { useContext } from '@antv/gi-sdk';

const MyComponent = () => {
  const {
    context, // 包含画布状态的快照
    assets, // 资产信息
    services, // 服务数组
    GISDK_ID, // 画布的唯一标识
    id, // 同 GISDK_ID
    graph, // IGraph 图形实例
    updateContext, // 函数，用于更新画布的状态
    updateGraph, // 函数，用于更新 IGraph 实例
  } = useContext();
};
```

其中，`context` 包含下述这么多变量，这些变量都是 `valtio` 的 `proxy` 对象，这就意味着，只有当你的组件中，消费到这些变量的时候，它才触发重绘

| Key               | Type                  | Description                                      |
| ----------------- | --------------------- | ------------------------------------------------ |
| `apis`            | `any`                 | 存储与画布相关的 API 方法。                      |
| `renderer`        | `string`              | 指示使用的渲染器类型。                           |
| `HAS_GRAPH`       | `boolean`             | 指示是否已经加载了图形。                         |
| `GISDK_ID`        | `string`              | 画布的唯一标识。                                 |
| `isLoading`       | `boolean`             | 指示画布是否正在加载数据。                       |
| `data`            | `GraphinData`         | 存储图形的数据，包括节点和边。                   |
| `source`          | `GraphinData`         | 存储原始图形数据。                               |
| `schemaData`      | `GraphSchemaData`     | 存储图形的模式数据。                             |
| `largeGraphLimit` | `number`              | 定义大图模式的节点数限制。                       |
| `largeGraphData`  | `GraphinData`         | 用于大图模式下的图形数据。                       |
| `largeGraphMode`  | `boolean`             | 指示是否启用大图模式。                           |
| `nodes`           | `GINodeConfig[]`      | 数组存储节点配置。 `props.config.nodes`          |
| `edges`           | `GIEdgeConfig[]`      | 数组存储边配置。 `props.config.edges`            |
| `layout`          | `GILayoutConfig`      | 存储图形布局配置。 `props.config.layout`         |
| `components`      | `GIComponentConfig[]` | 数组存储组件配置。 `props.config.components`     |
| `pageLayout`      | `any`                 | 用于存储页面布局配置。 `props.config.pageLayout` |
| `initialized`     | `boolean`             | 指示画布是否已初始化。                           |
| `prepare`         | `boolean`             | 可能用于指示预备状态或前置条件。                 |
