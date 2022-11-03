## LargeGraph 大图展示

```jsx
import TestSDK, { Mock } from '@antv/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const services = [
  {
    id: 'My_Service',
    service: params => {
      return fetch('https://gw.alipayobjects.com/os/bmw-prod/9995f073-7869-4ae1-aa2a-386a92a3980f.json')
        .then(res => res.json())
        .then(res => {
          console.log('res', res);
          return res;
        });
    },
  },
];

const App = props => {
  return (
    <div>
      <TestSDK asset={Asset} services={services} />
    </div>
  );
};

export default App;
```
