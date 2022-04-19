## PropertiesPanel 属性面板

```jsx
import TestSDK, { Mock } from '@alipay/gi-assets-testing';
import * as React from 'react';
import Asset from './index.tsx';

const App = props => {
  return (
    <div>
      <TestSDK asset={Asset} type="AUTO" />
    </div>
  );
};

export default App;
```
