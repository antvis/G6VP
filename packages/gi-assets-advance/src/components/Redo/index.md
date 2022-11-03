## Redo 重做

```jsx
import TestSDK, { Mock } from '@antv/gi-assets-testing';
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
