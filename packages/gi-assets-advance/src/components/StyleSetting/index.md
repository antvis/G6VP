## StyleSetting 样式设置

```jsx
import TestSDK, { Mock } from '@antv/gi-assets-testing';
import * as React from 'react';
import StyleSetting from './Component.tsx';
import Asset from './index.tsx';

// <TestSDK asset={Asset} />

const nodes = {
  uId: '112',
  name: '',
  pt: 'user',
  age: 23,
};

const data = {
  nodes: [
    {
      id: 'node1',
      nodeType: 'User',
      // 默认ID
      label: 'xxx',
      data: {
        id: 'node1',
        nodeType: 'User',
        // 默认ID
        label: 'xxx',
      },
    },
    {
      id: 'node1',
      label: 'Car',
      data: {
        id: 'node1',
        label: 'Car',
      },
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node1',
      edgeType: 'edge1',
    },
  ],
};
const App = props => {
  //<StyleSetting data={data} shapeOptions={[]} />
  return (
    <div>
      <TestSDK asset={Asset} type="GIAC_CONTENT" />
    </div>
  );
};

export default App;
```
