import { extra, useContext } from "@alipay/graphinsight";
import * as React from "react";
import ContainerHeader from "../../components-ui/ContainerHeader";
const { GIAComponent, deepClone } = extra;

export interface ClusterManageProps {}

const ClusterManage: React.FunctionComponent<ClusterManageProps> = (props) => {
  const context = useContext();

  return (
    <div>
      <ContainerHeader title="集群管理" />
      Cluster Manage
    </div>
  );
};

export default ClusterManage;
