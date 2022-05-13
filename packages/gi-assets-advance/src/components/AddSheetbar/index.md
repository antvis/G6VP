## AddSheetbar 添加到新画布中

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const App = props => {
  return (
    <div>
      <TestSDK asset={Asset} type="GIAC" />
    </div>
  );
};

export default App;
```
