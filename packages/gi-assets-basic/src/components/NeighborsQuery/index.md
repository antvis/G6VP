## NeighborsQuery 邻居查询

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const App = props => {
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

  return (
    <div>
      <TestSDK asset={Asset} services={services} type="GIAC_MENU" />
    </div>
  );
};

export default App;
```
