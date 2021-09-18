## NodeExpand

> 双击扩散节点

```jsx
import React from "react";
import NodeExpand from "./Component";
import GISDK, { Mock } from "@alipay/graphinsight";
import update, { updateChain } from "immutability-helper-x";

const DEMO = () => {
  const config = updateChain(Mock.config)
    .$set("layout.props.type", "graphin-force")
    .$push("components", [
      {
        id: "NodeExpand",
        props: {
          serviceId: "my_service_expand_node",
        },
        enable: true,
      },
    ])
    .value();
  const assets = updateChain(Mock.assets)
    .$set("components.NodeExpand", {
      info: { id: "NodeExpand" },
      component: NodeExpand,
      registerMeta: () => {},
    })
    .$push("services", [
      {
        id: "my_service_expand_node",
        service: (params) => {
          console.log("params", params);
          return new Promise((resolve) => {
            resolve({
              nodes: [
                {
                  id: `${params.id}_0`,
                },
                {
                  id: `${params.id}_1`,
                },
                {
                  id: `${params.id}_2`,
                },
              ],
              edges: [
                {
                  source: `${params.id}`,
                  target: `${params.id}_1`,
                },
                {
                  source: `${params.id}`,
                  target: `${params.id}_2`,
                },
              ],
            });
          });
        },
      },
    ])
    .value();

  return <GISDK config={config} assets={assets} />;
};

export default DEMO;
```
