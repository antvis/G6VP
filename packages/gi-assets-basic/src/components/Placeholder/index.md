## Placeholder 画布占位符

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const services = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    service: params => {
      return new Promise(resolve => {
        resolve({
          nodes: [],
          edges: [],
        });
      });
    },
  },
];

const App = props => {
  return (
    <div>
      <TestSDK asset={Asset} type="AUTO" services={services} />
    </div>
  );
};

export default App;
```
