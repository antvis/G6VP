import { useContext } from "@alipay/graphinsight";
import type { GIGraphSchema } from "@alipay/graphinsight";
import Graphin from "@antv/graphin";
import * as React from "react";
import CollapseCard from "../../../components-ui/CollapseCard";

import getSchemaGraph from "./getSchemaGraph";


export interface FormValues {
  id: string;
  displayName: string;
  content: string;
}
const DataSchema = () => {
  const { schemaData,  config } = useContext();

  const schemaGraph = getSchemaGraph(schemaData, config);

  return (
    <div>
      <CollapseCard
        title="图模型"
      >
        <Graphin
          style={{ width: "322px", height: "300px", minHeight: "300px" }}
          data={schemaGraph}
          fitView
          layout={{ type: "graphin-force", animation: false }}
        ></Graphin>
      </CollapseCard>
    </div>
  );
};

export default DataSchema;
