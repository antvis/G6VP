import { extra } from "@alipay/graphinsight";
import * as React from "react";
import ContainerHeader from "../../components-ui/ContainerHeader";
import DataImport from "./DataImport";
import DataSchema from "./DataSchema";

const { GIAComponent, deepClone } = extra;

export interface MyCounterProps {}

const MyCounter: React.FunctionComponent<MyCounterProps> = (props) => {
  return (
    <div>
      <ContainerHeader title="数据管理" />
      <DataSchema />
      <DataImport />
    </div>
  );
};

export default MyCounter;
