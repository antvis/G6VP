## NodeImportance

```jsx
import React from "react";
import Asset from "./index";
import TestSDK, { Mock } from "@alipay/gi-assets-testing";

const DEMO = () => {
  const services = [
    {
      id: "GI_SERVICE_INTIAL_GRAPH",
      service: () => {
        return new Promise((resolve) => {
          resolve({
            nodes: [
              { id: "node-1" },
              { id: "node-2" },
              { id: "node-3" },
              { id: "node-4" },
              { id: "node-5" },
              { id: "node-6" },
              { id: "node-7" },
              { id: "node-8" },
              { id: "node-9" },
              { id: "node-10" },
              { id: "node-11" },
            ],
            edges: [
              { source: "node-1", target: "node-2" },
              { source: "node-1", target: "node-3" },
              { source: "node-1", target: "node-4" },
              { source: "node-1", target: "node-5" },
              { source: "node-5", target: "node-6" },
              { source: "node-5", target: "node-7" },
              { source: "node-5", target: "node-8" },
              { source: "node-2", target: "node-7" },
              { source: "node-2", target: "node-8" },
              { source: "node-5", target: "node-8" },
              { source: "node-7", target: "node-9" },
              { source: "node-7", target: "node-10" },
              { source: "node-8", target: "node-11" },
            ],
          });
        });
      },
    },
  ];

  return <TestSDK asset={Asset} services={services} type="GIAC_CONTENT" />;
};

export default DEMO;
```
