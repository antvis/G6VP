## NodesClustering 节点聚类

```jsx
import TestSDK, { Mock } from '@antv/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';
import graphData from '../../mockData/graphData';

const services = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    service: params => {
      return new Promise(resolve => {
        resolve(graphData);
      });
    },
  },
];

const App = props => {
  return (
    <div>
      <TestSDK type="GIAC_CONTENT" asset={Asset} services={services} />
    </div>
  );
};

export default App;
```
