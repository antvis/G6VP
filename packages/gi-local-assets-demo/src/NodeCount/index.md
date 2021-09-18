## NodeCount

```jsx
import React from 'react';
import NodeCount from './Component';
import GISDK, { Mock } from '@alipay/graphinsight';

const DEMO = () => {
  const { config, assets } = Mock;
  config.layout.props.type = 'grid';
  config.components = [
    {
      id: 'NodeCount',
      props: {},
      enable: true,
    },
  ];
  assets.components = {
    NodeCount: {
      info: { id: 'NodeCount' },
      component: NodeCount,
      registerMeta: () => {},
    },
  };
  console.log('demo..');
  return <GISDK config={config} assets={assets} />;
};

export default DEMO;
```
