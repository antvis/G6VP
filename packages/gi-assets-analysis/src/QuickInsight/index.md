## QuickInsight 一键洞察

基于 AntV/AVA 的统计数据智能洞察资产

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const App = props => {
  return (
    <div>
      <TestSDK asset={Asset} type="GIAC" services={services} style={{ height: '700px' }} />
    </div>
  );
};

export default App;
```
