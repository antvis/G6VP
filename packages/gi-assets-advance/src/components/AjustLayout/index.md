## AjustLayout 子图布局

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import { Utils } from '@antv/graphin';
import * as React from 'react';
import Asset from './index.tsx';

const services = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    service: params => {
      return new Promise(resolve => {
        resolve(Utils.mock(20).tree().graphin());
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
