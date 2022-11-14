import * as React from "react";
import "./index.less";

interface ContainerHeaderProps {
  title: string;
}

const ContainerHeader: React.FunctionComponent<ContainerHeaderProps> = (
  props
) => {
  const { title } = props;
  return (
    <div className="container-header">
      <span>{title} </span>
      <span></span>
    </div>
  );
};

export default ContainerHeader;
