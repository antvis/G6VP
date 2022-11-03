## PatternMatch 模式匹配

```jsx
import TestSDK, { Mock } from '@antv/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const services = [
  {
    id: 'My_Service',
    service: params => {
      console.log(params);
      return new Promise(resolve => {
        resolve({
          nodes: [
            {
              id: `node-${Math.random()}`,
            },
          ],
          edges: [],
        });
      });
    },
  },
];

const App = props => {
  return (
    <div>
      <TestSDK asset={Asset} services={services} type="GIAC_CONTENT" />
    </div>
  );
};

export default App;
```
