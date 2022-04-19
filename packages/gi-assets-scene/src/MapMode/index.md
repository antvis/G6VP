## MapMode 地图模式

注意 ⚠️：启动该资产，数据结构有一个要求：数据中`latitude`和`longitude`属性必须存在，并且必须是数字。

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

import mockData from './mockData.json';
const mockServices = () => {
  return [
    {
      id: 'GI_SERVICE_INTIAL_GRAPH',
      service: (params, localData) => {
        return new Promise(resolve => {
          return resolve(mockData);
        });
      },
    },
  ];
};

const App = props => {
  const services = mockServices();
  const updateConfig = draft_config => {
    console.log('draft_config', JSON.parse(JSON.stringify(draft_config)));
    draft_config.nodes = [
      {
        id: 'SimpleNode',
        expression: [],
        props: {
          label: ['local_name'],
          size: [20],
          color: 'red',
        },
      },
    ];
  };

  return (
    <div>
      <TestSDK asset={Asset} type="GIAC" services={services} updateConfig={updateConfig} style={{ height: '700px' }} />
    </div>
  );
};

export default App;
```
