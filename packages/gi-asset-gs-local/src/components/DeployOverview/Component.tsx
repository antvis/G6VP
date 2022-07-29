import { extra, useContext } from "@alipay/graphinsight";
import * as React from "react";
const { GIAComponent, deepClone } = extra;

export interface MyCounterProps {}

const MyCounter: React.FunctionComponent<MyCounterProps> = (props) => {
  const context = useContext();

  return <div>Data Manage</div>;
};

export default MyCounter;
