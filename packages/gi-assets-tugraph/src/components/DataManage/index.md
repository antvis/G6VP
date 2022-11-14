## MyCounter 我的计时器

```jsx
import TestSDK, { Mock } from "@alipay/gi-assets-testing";
import * as React from "react";
import Asset from "./index.tsx";

const services = [
  {
    id: "My_Service",
    service: (params) => {
      console.log(params);
      return new Promise((resolve) => {
        resolve({
          nodes: [
            {
              id: `node-${Math.random()}`,
            },
          ],
          edges: [],
        });
      });
    },
  },
];

const App = (props) => {
  return (
    <div>
      <TestSDK asset={Asset} services={services} />
    </div>
  );
};

export default App;
```
