---
title: registerContext
order: 2
group:
  path: /api
  title: API
  order: 3
nav:
  title: GISDK
  path: /sdk
  order: 1
---

以内置的 `Canvas` 画布组件为例，它包含了 `apis` 等 6 个变量，`registerContext` 允许子组件将自己的变量注册到全局的 `context` 中，(准确讲叫 ObserveStore 更合理些)，从而使得使用它的组件触发重绘

```jsx | pure
import Graphin from '@antv/graphin';
import deepClone from 'lodash-es/cloneDeep';
import React, { useMemo } from 'react';
import { registerContext, useContext } from './Context';

const initialCanvasStore = {
  apis: {},
  HAS_GRAPH: false,
  data: {
    nodes: [],
    edges: [],
  },
  source: {
    nodes: [],
    edges: [],
  },
  schemaData: {
    nodes: [],
    edges: [],
  },
  renderer: 'canvas', //'webgl-3d',
};
registerContext(initialCanvasStore);
interface CanvasProps {}

const Canvas: React.FunctionComponent<CanvasProps> = props => {
  const { context, updateContext, assets, id, updateGraph } = useContext<typeof initialCanvasStore>();
  const { data, nodes, edges, layout, renderer } = context;
  return (
    <Graphin
      container={`${id}-graphin-container`}
      style={{ transform: 'scale(1)' }}
      //@ts-ignore
      node={nodeMapper}
      edge={edgeMapper}
      data={data}
      //@ts-ignore
      renderer={renderer}
      //@ts-ignore
      layout={runtime_layout}
      onInit={handleGraphInit}
      unMount={handleUnMount}
    />
  );
};

export default Canvas;


```
