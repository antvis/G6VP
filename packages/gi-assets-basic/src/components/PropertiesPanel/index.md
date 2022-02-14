## PropertiesPanel 属性面板

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';
const data = {
  nodes: [
    {
      id: 'node-1',
      data: {},
    },
    {
      id: 'node-2',
      data: {},
    },
    {
      id: 'node-3',
      data: {},
    },
  ],
  edges: [
    {
      source: 'node-1',
      target: 'node-2',
    },
  ],
};
const App = props => {
  const services = [
    {
      id: 'GI_SERVICE_INTIAL_GRAPH',
      service: () => {
        return new Promise(resolve => {
          resolve(data);
        });
      },
    },
    {
      id: 'PROPERTIES_INFO',
      service: params => {
        console.log(params);
        return new Promise(resolve => {
          resolve({
            id: params.id,
            city: 'hangzhou',
          });
        });
      },
    },
  ];
  return (
    <div>
      <TestSDK asset={Asset} services={services} />
    </div>
  );
};

export default App;
```
