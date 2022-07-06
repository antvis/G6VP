import React from "react";
import ReactDOM from "react-dom";
import useComponents from "./useComponents";
import { GIAssets } from "@alipay/graphinsight";
import useFreeLayoutStyle from "./useFreeLayoutStyle";

export interface FreeLayoutProps {
  GI_CONTAINER_LEFT: string[];
  GI_CONTAINER_RIGHT: string[];
  GI_CONTAINER_BOTTOM: string[];
  leftWidth: string;
  rightWidth: string;
  bottomHeight: string;
  ComponentCfgMap: object;
  assets: GIAssets;
  GISDK_ID: string;
}

const FreeLayout: React.FC<FreeLayoutProps> = (props) => {
  const {
    ComponentCfgMap,
    assets,
    GISDK_ID,
    GI_CONTAINER_LEFT = [],
    GI_CONTAINER_RIGHT = [],
    GI_CONTAINER_BOTTOM = [],
    leftWidth,
    rightWidth,
    bottomHeight,
  } = props;

  const LeftContent = useComponents(GI_CONTAINER_LEFT, ComponentCfgMap, assets);

  const RightContent = useComponents(
    GI_CONTAINER_RIGHT,
    ComponentCfgMap,
    assets
  );

  const BottomContent = useComponents(
    GI_CONTAINER_BOTTOM,
    ComponentCfgMap,
    assets
  );

  useFreeLayoutStyle(leftWidth, rightWidth, bottomHeight, GISDK_ID);

  return (
    <div>
      {ReactDOM.createPortal(
        LeftContent,
        document.getElementById(`${GISDK_ID}-free-layout-left`) as HTMLElement
      )}
      {ReactDOM.createPortal(
        RightContent,
        document.getElementById(`${GISDK_ID}-free-layout-right`) as HTMLElement
      )}
      {ReactDOM.createPortal(
        BottomContent,
        document.getElementById(`${GISDK_ID}-free-layout-bottom`) as HTMLElement
      )}
    </div>
  );
};

export default FreeLayout;
